import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GrandmastersList from './components/GrandmastersList';
import GrandmasterProfile from './components/GrandmasterProfile';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GrandmastersList />} />
        <Route path="/grandmaster/:username" element={<GrandmasterProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
