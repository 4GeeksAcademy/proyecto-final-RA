// src/js/component/MisDiscos.jsx
import React from "react";
import MisDiscosComponent from "./misDiscosComponent.jsx";
import { Link } from "react-router-dom";
// import "../../styles/misDiscos.css";
import SideBar from "./sideBar.jsx";
import "../../styles/components/_private.css";

const MisDiscos = () => {
  return (
    <div className="mis-discos-container d-flex flex-wrap">
      {/* <SideBar /> */}
      <div className="private-content">
        <MisDiscosComponent />
      </div>
    </div>
  );
};

export default MisDiscos;

