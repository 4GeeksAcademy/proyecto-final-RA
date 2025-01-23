// src/js/component/MisDiscos.jsx
import React from "react";
import MisDiscosComponent from "./misDiscosComponent.jsx"; // Asegurarse de que MisDiscosComponent esté exportado como nombrado
import { Link } from "react-router-dom";
import "../../styles/misDiscos.css";

const MisDiscos = () => {
  return (
    <div className="mis-discos-container"> 
      <Link to={"/private"}>
        <h1>Back</h1>
      </Link>
      <MisDiscosComponent /> 
    </div>
  );
};

export default MisDiscos;
