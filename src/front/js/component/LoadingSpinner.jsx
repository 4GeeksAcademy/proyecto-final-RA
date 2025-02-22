// components/LoadingSpinner.jsx
import React from 'react';
import { ClipLoader } from 'react-spinners'; // Necesitarás instalar react-spinners
// import LoadingSpinner from "../../styles/LoadingSpinner.css"

export const LoadingSpinner = () => (
  <div className="global-loading-overlay">
    <div className="loading-content">
      <ClipLoader color="#36d7b7" size={50} />
      <p className="loading-text">Cargando contenido...</p>
    </div>
  </div>
);