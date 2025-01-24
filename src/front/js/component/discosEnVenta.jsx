// src/js/component/DiscosEnVenta.jsx
import React from 'react';
import SellListComponent from './SellListComponent.jsx'; // Asegúrate de usar llaves para esta importación
import "../../styles/discosEnVenta.css";

const DiscosEnVenta = () => {
  return (
    <div className="discos-en-venta-container"> 
      <SellListComponent />
    </div>
  );
};


export default DiscosEnVenta;
