import React from 'react';
import "../../styles/_customCheckbox.css";
const CustomCheckbox = ({ id, checked, onChange, label }) => {
    return (
        <div className="custom-checkbox-container">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className="custom-checkbox-input"
            />
            <label htmlFor={id} className="custom-checkbox-label">
                <span className="custom-checkbox"></span>
                {label}
            </label>
        </div>
    );
};

export default CustomCheckbox;
