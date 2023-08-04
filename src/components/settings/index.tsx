import React from "react";
import { useSelector } from "react-redux";
import { actions, reduxHelpers } from "../../store";
import Specifications from "../specifications";
import "./settings.css";

const Settings : React.FC = () => {
  const isAuthorized = useSelector(reduxHelpers.isAuthorized);
  return (
    <div className="Settings">
      <h1>Settings</h1>
      <div className="w-100 row align-center justify-center">
        <div className="Settings-spec-container"> <Specifications /> </div>
      </div>
      {isAuthorized && (
        <a className='text-red-400 bg-red-50/100 py-2 px-6 rounded-md border-solid border border-red-400 my-2' href="https://billing.stripe.com/p/login/28obKwfrLb5L6WIaEE" target="_blank" >
          Fire Agent
        </a>
      )}
    </div>
  );
};

export default Settings;
