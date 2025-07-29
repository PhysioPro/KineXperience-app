import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import ModularGenerator from './components/ModularGenerator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generator" element={<ModularGenerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
