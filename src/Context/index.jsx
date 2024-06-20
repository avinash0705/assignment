import React, { createContext, useState, useContext } from 'react';

// Create the context
const FormContext = createContext();

// Custom hook to use the FormContext
export const useFormContext = () => useContext(FormContext);

// FormProvider component to provide the context to its children
export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        step: 0,
        groupName: '',
        structures: [],
        entities: [],
        members: []
    });

    const next = () => {
        setFormData(prevData => ({...prevData,  step: (prevData.step || 0) + 1}));
    }
    const prev = () => {
        setFormData(prevData => ({...prevData, step: (prevData.step || 1) - 1}));
    }

    const updateFormData = (newData) => {
        setFormData(prevData => ({ ...prevData, ...newData }));
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData, next, prev }}>
            {children}
        </FormContext.Provider>
    );
};
