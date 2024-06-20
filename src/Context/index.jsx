import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        step: 0,
        groupName: '',
        structures: [],
        entities: [],
        members: []
    });
    const [dataset, setDataset] = useState({
        structures: [],
        entities: [],
        members: []
    })

    const next = () => {
        setFormData(prevData => ({...prevData,  step: (prevData.step || 0) + 1}));
    }
    const prev = () => {
        setFormData(prevData => ({...prevData, step: (prevData.step || 1) - 1}));
    }

    const updateFormData = (newData) => {
        setFormData(prevData => ({ ...prevData, ...newData }));
    };

    const updateDataset = (newData) => {
        setDataset(prevData => ({ ...prevData, ...newData }));
    };

    return (
        <FormContext.Provider value={{ formData, dataset, updateFormData, updateDataset, next, prev }}>
            {children}
        </FormContext.Provider>
    );
};
