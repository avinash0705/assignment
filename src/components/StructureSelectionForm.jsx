import { useEffect, useState } from "react";
import { useFormContext } from "../Context";
import CustomCheckbox from "./Common/CustomCheckbox";
import "../styles/_structureSelectionForm.css";
import { fetchStructuresList } from "../xhr";
export function StructureSelectionForm ({ onNext, onPrev }) {

    const { formData, dataset, updateFormData, updateDataset } = useFormContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [structures, setStructures] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStructures = async () => {
            setLoading(true);
            const response = await fetchStructuresList();
            setStructures(response.data);
            updateDataset({ structures: response.data });
            setLoading(false);
        };

        const structuresList = formData.structures|| dataset.structures;

        if (structuresList.length === 0 ) {
            fetchStructures();
        } else {
            setStructures(structuresList);
        }
    }, []);

    const handleStructureChange = (id) => {
        const updatedStructures = structures.map(structure =>
            structure.id === id ? { ...structure, selected: !structure.selected, roleId: structure.roleId || "1" } : structure
        );
        setStructures(updatedStructures);
        updateFormData({ structures: updatedStructures });
    };

    const areAllStructureSelected = () => {
        return filteredStructures.every(s => s.selected) || false;
    }

    const handleSelectAll = () => {
        const newSelectAll = !areAllStructureSelected();
        const updatedStructures = structures.map(structure =>
            filteredStructures.find(s => structure.id === s.id) ? ({
            ...structure,
            selected: newSelectAll
        }) : structure);
        setStructures(updatedStructures);
        updateFormData({ structures: updatedStructures });
    };

    const handleRoleChange = (structureId, newRoleId) => {
        const updatedStructures = structures.map(structure =>
            structure.id === structureId ? { ...structure, roleId: newRoleId } : structure
        );
        setStructures(updatedStructures);
        updateFormData({ structures: updatedStructures });
    };



    const filteredStructures = structures.filter(structure =>
        structure.label.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return <div id="formStructureSelection" className="form-container">
        <div className="title-wrapper">
            <h2 className="form-heading">Which structures would you like to grant access to?</h2>
            <span className="help-text">Access is required to at least one structure</span>
            <div className="search-bar">
                <span className="search-ico"/>
                <input id="structureName" maxLength={100} onChange={(e) => setSearchTerm(e.target.value)} className="input-container" placeholder="Search"></input>
                <span className="count">{structures.length} Structures</span>
            </div>
        </div>
        

        <div className="listing-wrapper">
            <div className="top-head">
                <div className="item">
                    <CustomCheckbox
                        id="select-all"
                        checked={areAllStructureSelected()}
                        onChange={handleSelectAll}
                        label="Structure"
                    />
                </div>
                <span className="role">Role</span>
                
            </div>

            <div className="list-container">
                {
                    filteredStructures.map(structure => <div className="list-item">
                            <div className="structure-container">
                            <CustomCheckbox
                                key={structure.id}
                                id={`structure-${structure.id}`}
                                checked={structure.selected || false}
                                onChange={() => handleStructureChange(structure.id)}
                                label={structure.label}
                            />
                                {/* <input checked={structure.selected} onChange={() => handleCheckboxChange(structure.id)} id={structure.label} data-id={structure.id} type="checkbox" />
                                <label htmlFor={structure.label}>{structure.label}</label> */}
                            </div>
                            <div className="roles-container">
                                <select
                                    id={`role-${structure.id}`}
                                    value={structure.roleId || structure.roles[0].id}
                                    onChange={(e) => handleRoleChange(structure.id, parseInt(e.target.value))}
                                >
                                    {structure.roles.map(opt => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
       
    </div>
}