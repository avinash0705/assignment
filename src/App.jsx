import logo from './logo.svg';
import './App.css';
import PermissionGroupForm from './components/PermissionGroupForm';
import { FormContext, FormProvider } from './Context';
import { useCallback, useState } from 'react';
import { Routes, Route } from "react-router-dom"

function App() {
  const [formState, setFormState] = useState({});
  const handleFormChange = useCallback((label, value) => {
    try {
        const preFormState = {...formState};
        const newFormState = {...preFormState, [label]: value};
        setFormState(newFormState);
    } catch (err) {
        console.warn(err);
    }
},[]);
  return (
    <FormProvider>
    <div className="App">
      <PermissionGroupForm />
    </div>
  </FormProvider>
  );
}

export default App;
