import React from "react";
import Specifications from "../specifications";
import "./settings.css";

const Settings : React.FC = () => {
  return (
    <div className="Settings">
      <h1>Settings</h1>
      <div className="w-100 row align-center justify-center">
        <div className="Settings-spec-container"> <Specifications /> </div>
      </div>
    </div>
  );
};

export default Settings;
