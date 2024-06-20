import Timeline from "./Timeline";
import "../styles/_permissionGroup.css";
import addLogo from "../asset/images/Icon.svg";
import FormComponent from "./FormComponent";
import { useCallback, useContext, useState } from "react";
import { useFormContext } from "../Context";

const TimelineSteps = ["Group name", "Structures", "Entities", "Members"];

export default function PermissionGroupForm () {

    const { formData, updateFormData, prev, next } = useFormContext();
    const step = formData?.step || 0;

    const cancelText = step === 0 ? "Cancel" : "Go back";
    const submitText = step === 3 ? "Finish" : "Next";


    const handleFinish = () => {
        const payload = {
            groupName: formData.groupName,
            structures: formData.structures,
            entities: formData.entities,
            members: formData.members.filter(member => member.selected)
        };
        console.log("Form payload", payload);
        //onSubmit(payload);
    };

    const handleSubmit = useCallback((e) => {
        try {
            e.preventDefault();
            console.log("form data", formData);
            if(step === 3) {
                handleFinish();
            } else {
                next();
            }
            
        } catch (err) {
            console.warn(err);
        }
    },[formData]);

    const handleCancel = useCallback((e) => {
        try {
            e.preventDefault();
            console.log("form data", formData);
            prev();
           
        } catch (err) {
            console.warn(err);
        }
    },[formData]);

    return <form className="permission-form-container" onSubmit={handleSubmit}>
        <header className="title-container">
            <span className="add-logo"><img src={addLogo} alt="add-logo" /></span>
            <p className="title">Create a new permissions group</p>
        </header>
        <Timeline steps={TimelineSteps} />
        <FormComponent  />
        <footer className="action-container">
            <button type="button" onClick={handleCancel} className="btn second">{cancelText}</button>
            <button type="submit" className="btn primary">{submitText}</button>
        </footer>
    </form>
}