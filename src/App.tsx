import React from 'react';
import TopNav from "./components/TopNav";
import {Route, Routes} from "react-router-dom";

const App = () => {
  return (
      <>
        <TopNav/>
        {/*<Routes>*/}
        {/*  <Route path="/" element={<AllEntries/>}/>*/}
        {/*  <Route path="/allEntries" element={<AllEntries/>}/>*/}
        {/*  <Route path="/random" element={<RandomLink/>}/>*/}
        {/*</Routes>*/}
      </>
  );
}

export default App;
