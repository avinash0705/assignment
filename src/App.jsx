import './App.css';
import PermissionGroupForm from './components/PermissionGroupForm';
import {FormProvider } from './Context';
import { useCallback, useState } from 'react';

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
