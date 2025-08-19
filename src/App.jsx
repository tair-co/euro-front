import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/bootstrap.min.css";

import Home from "./Screens/Home";
import ChatterBlast from "./Screens/ChatterBlast";
import DreamWeaver from "./Screens/DreamWeaver";
import MindReader from "./Screens/MindReader";
import Card from "./UI/Card";
import NotFoundPage from "./Error/NotFoundPage";

// main component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <Card>
              <Home />
            </Card>
          }
        />
        <Route
          path="/chatter"
          element={
            <Card>
              <ChatterBlast />
            </Card>
          }
        />
        <Route
          path="/generator"
          element={
            <Card>
              <DreamWeaver />
            </Card>
          }
        />
        <Route
          path="/recognizer"
          element={
            <Card>
              <MindReader />
            </Card>
          }
        />
        <Route
          path="*"
          element={
            <Card>
              <NotFoundPage />
            </Card>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
