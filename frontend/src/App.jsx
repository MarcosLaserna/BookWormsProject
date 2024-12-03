import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PreferencesForm from './components/PreferencesForm';
import Recommendations from './components/Recommendations';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PreferencesForm />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </Router>
  );
};

export default App;
