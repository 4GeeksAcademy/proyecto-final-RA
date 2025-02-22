
import React from 'react';
import SellListComponent from './SellListComponent.jsx';
import SideBar from './sideBar.jsx';
import "../../styles/components/_private.css";

const DiscosEnVenta = () => {
  return (
    <div className="mis-discos-container d-flex flex-wrap">
    <div className="private-content"> 
      <SellListComponent />
    </div>
  </div>
  );
};


export default DiscosEnVenta;
