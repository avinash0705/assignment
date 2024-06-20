import { useContext, useEffect, useState } from "react";
import { useFormContext } from "../Context";
import { GroupNameForm } from "./GroupNameForm";
import { StructureSelectionForm } from "./StructureSelectionForm";
import { SelectMembersForm } from "./SelectMembersForm";
import EntitiesSelectionForm from "./EntitiesSelectionForm";

export default function FormComponent () {
    const { formData } = useFormContext();
    const activeStep = formData.step;
    switch (activeStep) {
        case 0:
            return <GroupNameForm />;
        case 1:
            return <StructureSelectionForm />;
        case 2:
            return <EntitiesSelectionForm />;
        case 3:
            return <SelectMembersForm />;
    
        default:
            return <GroupNameForm />;
    }

}







