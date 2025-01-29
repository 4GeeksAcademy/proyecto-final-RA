// src/js/component/MisDiscos.jsx
import React from "react";
import MisDiscosComponent from "./misDiscosComponent.jsx"; // Asegurarse de que MisDiscosComponent esté exportado como nombrado
import { Link } from "react-router-dom";
import "../../styles/misDiscos.css";
import SideBar from "./sideBar.jsx";

const MisDiscos = () => {
  return (
    <div className="mis-discos-container">
      <Link to={"/private"}>
        <h1>Back</h1>
      </Link>

      <div className="main-content">
        <SideBar />
        <div className="content-area">
          <MisDiscosComponent />
        </div>
      </div>
    </div>
  );
};

export default MisDiscos;

