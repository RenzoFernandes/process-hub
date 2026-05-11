import { Routes, Route } from "react-router-dom";

import { Dashboard } from "./pages/Dashboard";
import { Areas } from "./pages/Areas";
import { Processes } from "./pages/Processes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/processos" element={<Processes />} />
      <Route path="/areas" element={<Areas />} />
    </Routes>
  );
}

export default App;
