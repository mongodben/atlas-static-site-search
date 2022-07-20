import React from "react";
import "./App.css";
import SearchPage from "./pages/SearchPage";
import { APP_ID } from "./constants";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <SearchPage id={APP_ID} />
    </div>
  );
}

export default App;
