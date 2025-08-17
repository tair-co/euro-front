import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Screens/Home";
import ChatterBlast from "./Screens/ChatterBlast";
import DreamWeaver from "./Screens/DreamWeaver";
import MindReader from "./Screens/MindReader";
import Card from "./UI/Card";

// layout default
const layout = (component) => {
  return <Card>{component}</Card>;
};

// main component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={layout(<Home />)} />
        <Route path="/chatter" element={layout(<ChatterBlast />)} />
        <Route path="/generator" element={layout(<DreamWeaver />)} />
        <Route path="/regonizer" element={layout(<MindReader />)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
