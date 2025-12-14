import Calendar from "./components/Calendar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Schedule</h1>
        <Calendar/>
      </div>
    </BrowserRouter>
      
  );
}

export default App;
