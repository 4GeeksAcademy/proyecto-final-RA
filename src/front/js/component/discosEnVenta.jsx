// src/js/component/DiscosEnVenta.jsx
import React from 'react';
import SellListComponent from './SellListComponent.jsx'; // Asegúrate de usar llaves para esta importación
import "../../styles/discosEnVenta.css";
import SideBar from './sideBar.jsx';

const DiscosEnVenta = () => {
  return (
    <div className="discos-en-venta-page-container d-flex flex-wrap">
      <SideBar />
    <div className="discos-en-venta-container"> 
      <SellListComponent />
    </div>
  </div>
  );
};


export default DiscosEnVenta;
