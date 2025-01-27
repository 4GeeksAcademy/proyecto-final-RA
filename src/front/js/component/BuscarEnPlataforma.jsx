import React from 'react';
import "../../styles/searchWorldWide.css";
import SideBar from "./sideBar.jsx";

const BuscarEnPlataforma = () => {
  return (
    <div className="searchWorldwide-page-container d-flex flex-wrap">
      <SideBar />
      <div className="searchWorldwide-content-container">
        <h2>Descubre Artistas alrededor del mundo!</h2>
        <p>Explora música de todos los rincones del planeta y encuentra tus nuevos artistas favoritos.</p>
      </div>
    </div>
  );
};

export default BuscarEnPlataforma;

