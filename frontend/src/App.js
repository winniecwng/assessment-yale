import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Publication from "./components/Publication";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Use the 'element' prop to specify the component */}
        <Route exact path="/" element={<Home />} />
        <Route path="/publication/:id" element={<Publication />} />
      </Routes>
    </Router>
  );
}
