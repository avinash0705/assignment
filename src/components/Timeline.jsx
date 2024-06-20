import React from "react";
import "../styles/_timeline.css";
import { useFormContext } from "../Context";
export default function Timeline (props) {
    const {steps} = props;
    const { formData } = useFormContext();

    const active = formData?.step || 0;
    console.log("active", active);

    return <div className="timeline-container">
        {
            steps.map((step, idx) => <>
                <div className={`step ${idx === active ? "active": ""}`}>
                    <div className="step-base">
                        <span className="line"/>
                        {
                            idx < active ? <span className="done step-number"/> : 
                            <span className="step-number">{idx+1}</span>
                        }
                        <span className="line"/>
                    </div>
                    <span className="step-name">{step}</span>
                </div>
            </>)
        }
    </div>
}