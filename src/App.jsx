import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import ChoosePositions from "./Components/ChoosePositions";
import GetPicIdeas from "./Components/GetPicIdeas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose-position" element={<ChoosePositions />} />
        <Route path="/get-ideas" element={<GetPicIdeas />} />
      </Routes>
    </Router>
  );
}

export default App;
