import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Leads from "./pages/Leads";
import Metrics from "./pages/Metrics";
import Queues from "./pages/Queues";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <main className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/queues" element={<Queues />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
