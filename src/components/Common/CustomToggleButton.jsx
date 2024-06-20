import React from 'react';
import "../../styles/_customToggleButton.css";

const CustomToggleButton = ({ id, checked, onChange, content }) => {
    const handleContainerClick = (e) => {
        if (e.target.tagName !== 'INPUT') {
            onChange(e);
        }
    };

    return (
        <div className="custom-toggle-container" onClick={handleContainerClick}>
            <div className="content-wrapper">
                {content}
            </div>
            <label className="switch" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    className="custom-toggle-input"
                />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default CustomToggleButton;
