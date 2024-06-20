import React, { useEffect, useState } from "react";
import { useFormContext } from "../Context";
import CustomCheckbox from "./Common/CustomCheckbox";
import "../styles/_entitiesSelectionForm.css";

const mockEntitiesData = [
    {
        id: 1,
        label: "Structure 1",
        roleId: 2,
        roleLabel: "Basic Access",
        countries: [
            {
                id: 101,
                label: "Country 1",
                roleId: 1,
                entities: [
                    { id: 1001, label: "Entity 1", selected: false },
                    { id: 1002, label: "Entity 2", selected: false },
                ],
            },
            {
                id: 102,
                label: "Country 2",
                roleId: 1,
                entities: [
                    { id: 2001, label: "Entity 3", selected: false },
                    { id: 2002, label: "Entity 4", selected: false },
                ],
            },
        ],
    },
    {
        id: 2,
        label: "Structure 2",
        roleId: 3,
        roleLabel: "Full Access",
        countries: [
            {
                id: 103,
                label: "Country 3",
                roleId: 1,
                entities: [
                    { id: 3001, label: "Entity 5", selected: false },
                    { id: 3002, label: "Entity 6", selected: false },
                ],
            },
            {
                id: 104,
                label: "Country 4",
                roleId: 1,
                entities: [
                    { id: 4001, label: "Entity 7", selected: false },
                    { id: 4002, label: "Entity 8", selected: false },
                ],
            },
        ],
    },
    {
        id: 3,
        label: "Structure 3",
        roleId: 3,
        roleLabel: "Full Access",
        countries: [
            {
                id: 105,
                label: "Country 5",
                roleId: 1,
                entities: [
                    { id: 5001, label: "Entity 9", selected: false },
                    { id: 5002, label: "Entity 10", selected: false },
                ],
            },
            {
                id: 106,
                label: "Country 6",
                roleId: 1,
                entities: [
                    { id: 6001, label: "Entity 11", selected: false },
                    { id: 6002, label: "Entity 12", selected: false },
                ],
            },
        ],
    },
];

const EntitiesSelectionForm = () => {
    const { formData, updateFormData } = useFormContext();
    const [entitiesData, setEntitiesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedStructures, setExpandedStructures] = useState({});
    const [expandedCountries, setExpandedCountries] = useState({});
    const [loading, setLoading] = useState(false);
    console.log("Entities data", entitiesData);
    // Initialize entities state and handle pre-filled data
    useEffect(() => {
        const initializeEntities = () => {
            const initialEntitiesData = mockEntitiesData.map((structure) => {
                // Check if all countries within the structure were selected
                const allCountriesSelected =
                    structure.countries.every((country) =>
                        formData.entities?.some((e) => e.countryId === country.id)
                    ) || false;
    
                return {
                    ...structure,
                    selected:
                        allCountriesSelected &&
                        formData.structures?.find((s) => s.id === structure.id)
                            ?.selected,
                    countries: structure.countries.map((country) => {
                        // Check if all entities within the country were selected
                        const allEntitiesSelected =
                            country.entities.every((entity) =>
                                formData.entities?.some((e) => e.entityId === entity.id)
                            ) || false;
    
                        return {
                            ...country,
                            selected:
                                allEntitiesSelected &&
                                formData.structures
                                    ?.find((s) => s.id === structure.id)
                                    ?.countries?.find((c) => c.id === country.id)
                                    ?.selected,
                            roleId:
                                formData.entities?.find((e) => e.countryId === country.id)
                                    ?.countryRole || country.roleId,
                            entities: country.entities.map((entity) => ({
                                ...entity,
                                selected: formData.entities?.some((e) => e.entityId === entity.id) || false,
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
    }, []);
    

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
            prevData.map((structure) =>
                structure.id === structureId
                    ? {
                          ...structure,
                          countries: structure.countries.map((country) =>
                              country.id === countryId
                                  ? {
                                        ...country,
                                        entities: country.entities.map((entity) =>
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
            prevData.map((structure) =>
                structure.id === structureId
                    ? {
                          ...structure,
                          countries: structure.countries.map((country) =>
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
            prevData.map((structure) =>
                structure.id === structureId
                    ? {
                          ...structure,
                          countries: structure.countries.map((country) =>
                              country.id === countryId
                                  ? {
                                        ...country,
                                        selected: selectAll,
                                        entities: country.entities.map((entity) => ({
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
            prevData.map((structure) =>
                structure.id === structureId
                    ? {
                          ...structure,
                          selected: !structure.selected,
                          countries: structure.countries.map((country) =>
                            ({
                                ...country,
                                selected: !structure.selected,
                                entities: country.entities.map((entity) => ({
                                    ...entity,
                                    selected: !structure.selected,
                                })),
                            })
                          ),
                      }
                    : structure
            )
        );
    };
    

    const handleSelectAllStructures = () => {
        const newSelectAll = !isAllSelected();
        setEntitiesData((prevData) =>
            prevData.map((structure) => ({
                ...structure,
                selected: newSelectAll,
                countries: structure.countries.map((country) => ({
                    ...country,
                    selected: newSelectAll,
                    entities: country.entities.map((entity) => ({
                        ...entity,
                        selected: newSelectAll,
                    })),
                })),
            }))
        );
    };

    const handleExpandAll = () => {
        const allStructureIds = entitiesData.map((structure) => structure.id);
        const allCountryIds = entitiesData.flatMap((structure) =>
            structure.countries.map((country) => country.id)
        );

        setExpandedStructures(Object.fromEntries(allStructureIds.map((id) => [id, true])));
        setExpandedCountries(Object.fromEntries(allCountryIds.map((id) => [id, true])));
    };

    const handleCollapseAll = () => {
        setExpandedStructures({});
        setExpandedCountries({});
    };

    useEffect(() => {
        const updatedAssignments = entitiesData.flatMap((structure) =>
            structure.countries.flatMap((country) =>
                country.entities
                    .filter((entity) => entity.selected)
                    .map((entity) => ({
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
                return country?.entities.every((entity) => entity.selected) || false;
            }) || false
        );
    };

    const isAllEntitiesSelected = (structureId, countryId) => {
        const structure = entitiesData?.find((s) => s.id === structureId);
        const country = structure?.countries?.find((c) => c.id === countryId);
        return (
            country?.entities.every((entity) => entity.selected) || false
        );
    };

    const isAllSelected = () => {
        return entitiesData.every((structure => {
            return structure?.countries?.every((country) => {
                return country?.entities.every((entity) => entity.selected) || false;
            }) || false;
        })) || false;
 
    }

    return (
        <div id="formEntitiesSelection" className="form-container">
            <div className="title-wrapper">
                <h2 className="form-heading">Which structures would you like to grant access to?</h2>
                <span className="help-text">Access is required to at least one structure</span>
                <div className="search-bar">
                    <span className="search-ico"/>
                    <input id="structureName" maxLength={100} onChange={(e) => setSearchTerm(e.target.value)} className="input-container" placeholder="Search"></input>
                    <span className="count">{"entities length"}</span>
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
                {entitiesData.map((structure) => (
                    <div key={structure.id} className="structure-item">
                        <div className="structure-header">
                            <CustomCheckbox
                                id={`structure-${structure.id}`}
                                checked={isAllCountriesSelected(structure.id)}
                                onChange={() =>
                                    handleSelectStructure(structure.id)
                                }
                                label={""}
                            />
                            <span
                                className={`expand-icon ${
                                    expandedStructures[structure.id]
                                        ? ""
                                        : "right"
                                }`}
                                onClick={() =>
                                    handleStructureToggle(structure.id)
                                }
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
                                {structure.countries.map((country) => (
                                    <div
                                        key={country.id}
                                        className="country-item"
                                    >
                                        <div className="country-header">
                                            <div className="details">
                                                <CustomCheckbox
                                                    id={`country-${country.id}`}
                                                    checked={isAllEntitiesSelected(
                                                        structure.id,
                                                        country.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectAllEntities(
                                                            structure.id,
                                                            country.id,
                                                            !isAllEntitiesSelected(
                                                                structure.id,
                                                                country.id
                                                            )
                                                        )
                                                    }
                                                    label={""}
                                                />
                                                <span
                                                    className={`expand-icon ${
                                                        expandedCountries[
                                                            country.id
                                                        ]
                                                            ? ""
                                                            : "right"
                                                    }`}
                                                    onClick={() =>
                                                        handleCountryToggle(
                                                            country.id
                                                        )
                                                    }
                                                ></span>
                                                <span className="country-label">
                                                    {country.label}
                                                </span>
                                            </div>
                                            <select
                                                id={`country-role-${country.id}`}
                                                value={country.roleId || 1}
                                                onChange={(e) =>
                                                    handleCountryRoleChange(
                                                        e,
                                                        structure.id,
                                                        country.id
                                                    )
                                                }
                                            >
                                                <option value={1}>
                                                    No Access
                                                </option>
                                                <option value={2}>
                                                    Basic Access
                                                </option>
                                                <option value={3}>
                                                    Full Access
                                                </option>
                                            </select>
                                        </div>
                                        {expandedCountries[country.id] && (
                                            <div className="entities-list">
                                                {country.entities.map(
                                                    (entity) => (
                                                        <div
                                                            key={entity.id}
                                                            className="entity-item"
                                                        >
                                                            <CustomCheckbox
                                                                id={`entity-${entity.id}`}
                                                                checked={
                                                                    entity.selected
                                                                }
                                                                onChange={() =>
                                                                    handleEntityChange(
                                                                        structure.id,
                                                                        country.id,
                                                                        entity.id
                                                                    )
                                                                }
                                                                label={
                                                                    entity.label
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                )}
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
