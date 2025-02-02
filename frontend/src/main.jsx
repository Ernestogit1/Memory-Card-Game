import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Login/Register';
import Play from './MemoryCardGame/Play';
import Easy from './MemoryCardGame/MemoryEasy';
import Medium from './MemoryCardGame/MemoryMedium';
import CalmEasy from './MemoryCardGame/CalmEasy';
import CalmMedium from './MemoryCardGame/CalmMedium';
import CalmHard from './MemoryCardGame/CalmHard';
import MemoryCardGame from './MemoryCardGame/MemoryCardGame';
import Congratulations from "./MemoryCardGame/Congratulation";
import CongtEasy from "./MemoryCardGame/Congratseasy";
import CongtNormal from "./MemoryCardGame/Congratsnormal";
import CalmCngtHard from "./MemoryCardGame/CalmCongtHard";
import CalmCngtNormal from "./MemoryCardGame/CalmCongtNormal";
import CalmCngtEasy from "./MemoryCardGame/CalmCongtEasy";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // const handleLogout = () => {
  //   setIsAuthenticated(false);
  //   localStorage.removeItem('token');
  // };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/congratulations"
      element={isAuthenticated ? <Congratulations /> : <Navigate to="/login" />}
      />
      <Route path="/calm-congt-hard"
      element={isAuthenticated ? <CalmCngtHard /> : <Navigate to="/login" />}
      />
        <Route path="/calm-congt-normal"
      element={isAuthenticated ? <CalmCngtNormal /> : <Navigate to="/login" />}
      />
       <Route path="/calm-congt-easy"
      element={isAuthenticated ? <CalmCngtEasy /> : <Navigate to="/login" />}
      />
      <Route path="/congt-easy"
      element={isAuthenticated ? <CongtEasy /> : <Navigate to="/login" />}
      />
      <Route path="/congt-normal"
      element={isAuthenticated ? <CongtNormal /> : <Navigate to="/login" />}
      />
        <Route path="/easy" 
       element={isAuthenticated ? <Easy /> : <Navigate to="/login" />}
        />
        <Route path="/medium" 
         element={isAuthenticated ? <Medium /> : <Navigate to="/login" />}
         />
        <Route
          path="/play"
          element={isAuthenticated ? <Play /> : <Navigate to="/login" />}
        />
           <Route path="/calm-easy" 
       element={isAuthenticated ? <CalmEasy /> : <Navigate to="/login" />}
        />
        <Route path="/calm-medium" 
         element={isAuthenticated ? <CalmMedium /> : <Navigate to="/login" />}
         />
        <Route
          path="/calm-hard"
          element={isAuthenticated ? <CalmHard/> : <Navigate to="/login" />}
        />
        <Route
          path="/memory-card-game"
          element={isAuthenticated ? <MemoryCardGame /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
