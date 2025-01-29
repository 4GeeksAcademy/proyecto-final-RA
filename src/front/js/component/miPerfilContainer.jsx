import React from "react";
import { MiPerfil } from "./miPerfil.jsx";
import "../../styles/userProfile.css"; // Asegúrate de que el CSS esté importado
import SideBar from "./sideBar.jsx";

export const MiPerfilContainer = () => {
  return (
    <div className="register-container"> {/* Usa el mismo estilo del contenedor principal */}
      <div className="form-container"> {/* Usa el mismo estilo del formulario */}
        <SideBar />
        <MiPerfil />
      </div>
    </div>
  );
};
