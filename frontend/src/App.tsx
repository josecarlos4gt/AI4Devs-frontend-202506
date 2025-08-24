import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm';
import Positions from './components/Positions';
import PositionKanbanView from './features/positions/components/PositionKanbanView';
import PositionList from './features/positions/components/PositionList';
import './features/positions/components/PositionList.css';

const App: React.FC = () => {
  console.log('App rendering');
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/positions/list" element={<PositionList />} />
        <Route path="/positions/:id" element={<PositionKanbanView />} />
      </Routes>
    </div>
  );
};

export default App;