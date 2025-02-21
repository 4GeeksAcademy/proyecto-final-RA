// src/js/component/DiscosEnVenta.jsx
import React from 'react';
import SellListComponent from './SellListComponent.jsx'; // Asegúrate de usar llaves para esta importación
// import "../../styles/discosEnVenta.css";
import SideBar from './sideBar.jsx';
import "../../styles/components/_private.css";

const DiscosEnVenta = () => {
  return (
    <div className="mis-discos-container d-flex flex-wrap">
      {/* <SideBar /> */}
    <div className="private-content"> 
      <SellListComponent />
    </div>
  </div>
  );
};


export default DiscosEnVenta;
