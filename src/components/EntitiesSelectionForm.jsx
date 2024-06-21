import React, { useEffect, useState } from "react";
import { useFormContext } from "../Context";
import CustomCheckbox from "./Common/CustomCheckbox";
import "../styles/_entitiesSelectionForm.css";
import { fetchEntities } from "../xhr";

const EntitiesSelectionForm = () => {
    const { formData, dataset, updateFormData, updateDataset } = useFormContext();
    const structures = formData.structures || [];
    const entities = formData.entities || [];
    const [entitiesList, setEntitiesList] = useState(dataset.entities || []);
    const [entitiesData, setEntitiesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedStructures, setExpandedStructures] = useState({});
    const [expandedCountries, setExpandedCountries] = useState({});
    const totalEntities = entitiesList.reduce((acc, structure) => {
        const structureEntitiesCount = structure.countries.reduce((countryAcc, country) => {
            return countryAcc + country.entities.length;
        }, 0);
        return acc + structureEntitiesCount;
    }, 0);
    const [loading, setLoading] = useState(false);

    // Fetch entities if not already in context
    useEffect(() => {
        const getEntities = async () => {
            const selectedStructuresId = structures.filter(item => item.selected).map(item => item.id);
            const response = await fetchEntities(selectedStructuresId);
            setEntitiesList(response.data);
            updateDataset({ ...dataset, entities: response.data });
        };

        if (entitiesList.length === 0) {
            getEntities();
        }
    }, []);

    // Initialize entities data based on entities list and form data
    useEffect(() => {
        const initializeEntities = () => {
            const initialEntitiesData = entitiesList?.map((structure) => {
                const allCountriesSelected = structure.countries?.every((country) =>
                    country.entities.every((entity) => entities?.some((e) => e.entityId === entity.id))
                ) || false;

                return {
                    ...structure,
                    selected: allCountriesSelected && structures?.some((s) => s.id === structure.id && s.selected),
                    countries: structure.countries?.map((country) => {
                        const allEntitiesSelected = country.entities.every((entity) =>
                            entities?.some((e) => e.entityId === entity.id)
                        ) || false;

                        return {
                            ...country,
                            selected: allEntitiesSelected && structures?.some((s) => s.id === structure.id && s.countries?.some((c) => c.id === country.id && c.selected)),
                            roleId: entities?.find((e) => e.countryId === country.id)?.countryRole || country.roleId,
                            entities: country.entities?.map((entity) => ({
                                ...entity,
                                selected: entities?.some((e) => e.entityId === entity.id) || false,
                            })),
                        };
                    }),
                };
            });

            setEntitiesData(initialEntitiesData);
        };

        setLoading(true);
        initializeEntities();
        setLoading(false);
    }, [entitiesList]);

    const handleStructureToggle = (structureId) => {
        setExpandedStructures((prev) => ({
            ...prev,
            [structureId]: !prev[structureId],
        }));
    };

    const handleCountryToggle = (countryId) => {
        setExpandedCountries((prev) => ({
            ...prev,
            [countryId]: !prev[countryId],
        }));
    };

    const handleEntityChange = (structureId, countryId, entityId) => {
        setEntitiesData((prevData) =>
            prevData?.map((structure) =>
                structure.id === structureId
                    ? {
                          ...structure,
                          countries: structure.countries?.map((country) =>
                              country.id === countryId
                                  ? {
                                        ...country,
                                        entities: country.entities?.map((entity) =>
                                            entity.id === entityId
                                                ? {
                                                      ...entity,
                                                      selected: !entity.selected,
                                                  }
                                                : entity
                                        ),
                                    }
                                  : country
                          ),
                      }
                    : structure
            )
        );
    };

    const handleCountryRoleChange = (e, structureId, countryId) => {
        e.stopPropagation();
        const newRoleId = parseInt(e.target.value);
        setEntitiesData((prevData) =>
            prevData?.map((structure) =>
                structure.id === structureId
                    ? {
                          ...structure,
                          countries: structure.countries?.map((country) =>
                              country.id === countryId
                                  ? { ...country, roleId: newRoleId }
                                  : country
                          ),
                      }
                    : structure
            )
        );
    };

    const handleSelectAllEntities = (structureId, countryId, selectAll) => {
        setEntitiesData((prevData) =>
            prevData?.map((structure) =>
                structure.id === structureId
                    ? {
                          ...structure,
                          countries: structure.countries?.map((country) =>
                              country.id === countryId
                                  ? {
                                        ...country,
                                        selected: selectAll,
                                        entities: country.entities?.map((entity) => ({
                                            ...entity,
                                            selected: selectAll,
                                        })),
                                    }
                                  : country
                          ),
                      }
                    : structure
            )
        );
    };

    const handleSelectStructure = (structureId) => {
        setEntitiesData((prevData) =>
            prevData?.map((structure) =>
                structure.id === structureId
                    ? {
                          ...structure,
                          selected: !structure.selected,
                          countries: structure.countries?.map((country) => ({
                              ...country,
                              selected: !structure.selected,
                              entities: country.entities?.map((entity) => ({
                                  ...entity,
                                  selected: !structure.selected,
                              })),
                          })),
                      }
                    : structure
            )
        );
    };

    const handleSelectAllStructures = () => {
        const newSelectAll = !isAllSelected();
        setEntitiesData((prevData) =>
            prevData?.map((structure) => ({
                ...structure,
                selected: newSelectAll,
                countries: structure.countries?.map((country) => ({
                    ...country,
                    selected: newSelectAll,
                    entities: country.entities?.map((entity) => ({
                        ...entity,
                        selected: newSelectAll,
                    })),
                })),
            }))
        );
    };

    const handleExpandAll = () => {
        const allStructureIds = entitiesData?.map((structure) => structure.id);
        const allCountryIds = entitiesData?.flatMap((structure) =>
            structure.countries?.map((country) => country.id)
        );

        setExpandedStructures(Object.fromEntries(allStructureIds?.map((id) => [id, true])));
        setExpandedCountries(Object.fromEntries(allCountryIds?.map((id) => [id, true])));
    };

    const handleCollapseAll = () => {
        setExpandedStructures({});
        setExpandedCountries({});
    };

    useEffect(() => {
        const updatedAssignments = entitiesData?.flatMap((structure) =>
            structure.countries?.flatMap((country) =>
                country.entities
                    .filter((entity) => entity.selected)
                    ?.map((entity) => ({
                        structureId: structure.id,
                        countryId: country.id,
                        countryRole: country.roleId,
                        entityId: entity.id,
                    }))
            )
        );

        updateFormData({ entities: updatedAssignments });
    }, [entitiesData]);

    const isAllCountriesSelected = (structureId) => {
        const structure = entitiesData?.find((s) => s.id === structureId);
        return (
            structure?.countries?.every((country) => {
                return country?.entities?.every((entity) => entity.selected) || false;
            }) || false
        );
    };

    const isAllEntitiesSelected = (structureId, countryId) => {
        const structure = entitiesData?.find((s) => s.id === structureId);
        const country = structure?.countries?.find((c) => c.id === countryId);
        return (
            country?.entities?.every((entity) => entity.selected) || false
        );
    };

    const isAllSelected = () => {
        return entitiesData?.every((structure) => {
            return structure?.countries?.every((country) => {
                return country?.entities?.every((entity) => entity.selected) || false;
            }) || false;
        }) || false;
    };

    return (
        <div id="formEntitiesSelection" className="form-container">
            <div className="title-wrapper">
                <h2 className="form-heading">Which structures would you like to grant access to?</h2>
                <span className="help-text">Access is required to at least one structure</span>
                <div className="search-bar">
                    <span className="search-ico" />
                    <input
                        id="structureName"
                        maxLength={100}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-container"
                        placeholder="Search"
                    />
                    <span className="count">{totalEntities} Entities</span>
                </div>
            </div>

            <div className="top-head">
                <div className="left-head">
                    <CustomCheckbox
                        id="select-all-structures"
                        checked={isAllSelected()}
                        onChange={handleSelectAllStructures}
                        label="Entity"
                    />
                    <div className="action-cont">
                        <span className="act-btn" onClick={handleExpandAll}>
                            Expand All
                        </span>
                        <span className="sep">|</span>
                        <span className="act-btn" onClick={handleCollapseAll}>
                            Collapse All
                        </span>
                    </div>
                </div>
                <span className="role">Role</span>
            </div>

            <div className="listing-wrapper">
                {entitiesData?.map((structure) => (
                    <div key={structure.id} className={`structure-item ${expandedStructures[structure.id] ? 'expand' : ''}`}>
                        <div className="structure-header" onClick={() => handleStructureToggle(structure.id)}>
                            <CustomCheckbox
                                id={`structure-${structure.id}`}
                                checked={isAllCountriesSelected(structure.id)}
                                onChange={() => handleSelectStructure(structure.id)}
                                label=""
                            />
                            <span
                                className={`expand-icon ${expandedStructures[structure.id] ? '' : 'right'}`}
                            ></span>
                            <span className="structure-label">
                                {structure.label}
                            </span>
                            <span className="role-label">
                                {structure.roleLabel}
                            </span>
                        </div>
                        {expandedStructures[structure.id] && (
                            <div className="countries-list">
                                {structure.countries?.map((country) => (
                                    <div key={country.id} className={`country-item ${expandedCountries[country.id] ? 'expand' : ''}`}>
                                        <div className="country-header">
                                            <div className="details" onClick={() => handleCountryToggle(country.id)}>
                                                <CustomCheckbox
                                                    id={`country-${country.id}`}
                                                    checked={isAllEntitiesSelected(structure.id, country.id)}
                                                    onChange={() => handleSelectAllEntities(structure.id, country.id, !isAllEntitiesSelected(structure.id, country.id))}
                                                    label=""
                                                />
                                                <span
                                                    className={`expand-icon ${expandedCountries[country.id] ? '' : 'right'}`}
                                                ></span>
                                                <span className="country-label">
                                                    {country.label} {`(${country.entities?.length})`}
                                                </span>
                                            </div>
                                            <select
                                                id={`country-role-${country.id}`}
                                                value={country.roleId || 1}
                                                onChange={(e) =>
                                                    handleCountryRoleChange(e, structure.id, country.id)
                                                }
                                            >
                                                <option value={1}>No Access</option>
                                                <option value={2}>Basic Access</option>
                                                <option value={3}>Full Access</option>
                                            </select>
                                        </div>
                                        {expandedCountries[country.id] && (
                                            <div className="entities-list">
                                                {country.entities?.map((entity) => (
                                                    <div key={entity.id} className="entity-item">
                                                        <CustomCheckbox
                                                            id={`entity-${entity.id}`}
                                                            checked={entity.selected}
                                                            onChange={() => handleEntityChange(structure.id, country.id, entity.id)}
                                                            label={entity.label}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EntitiesSelectionForm;
