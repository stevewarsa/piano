import React from 'react';
import TopNav from "./components/TopNav";
import {Route, Routes} from "react-router-dom";
import AllEntries from "./pages/AllEntries";

const App = () => {
  return (
      <>
        <TopNav/>
        <Routes>
          <Route path="/" element={<AllEntries/>}/>
          <Route path="/allEntries" element={<AllEntries/>}/>
        </Routes>
      </>
  );
}

export default App;
