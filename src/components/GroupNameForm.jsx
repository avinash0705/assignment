import { useState } from "react";
import { useFormContext } from "../Context";
import "../styles/_groupNameForm.css";
export function GroupNameForm () {

    const { formData, updateFormData } = useFormContext();
    const [groupName, setGroupName] = useState(formData.groupName);

    const handleChange = (e) => {
        const newValue = e.target.value;
        updateFormData({ groupName: newValue });
        setGroupName(newValue);
    
    };


    return <div id="formGroupName" className="form-container">
        <h2 className="form-heading">Name your permissions group</h2>
        <div className="fields-container">
            <label htmlFor="group-name" className="label">Permissions group Name
            </label>
            <input required id="group-name" maxLength={100} autoComplete="off" onChange={handleChange} value={groupName} className="input-container" placeholder="Group name"></input>
            <span className="help-text">A descriptive name will help identify it in the future</span>

        </div>
        
    </div>
}