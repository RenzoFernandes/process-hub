import { Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Areas } from "./pages/Areas";
import { Processes } from "./pages/Processes";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/processos" element={<Processes />} />
        <Route path="/areas" element={<Areas />} />
      </Route>
    </Routes>
  );
}

export default App;
