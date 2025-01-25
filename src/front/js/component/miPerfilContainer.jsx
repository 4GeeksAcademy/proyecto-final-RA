import React from "react";
import { MiPerfil } from "./miPerfil.jsx";
import "../../styles/userProfile.css"; // Asegúrate de que el CSS esté importado

export const MiPerfilContainer = () => {
  return (
    <div className="container m-auto bg-dark">
      <MiPerfil />
    </div>
  );
};
