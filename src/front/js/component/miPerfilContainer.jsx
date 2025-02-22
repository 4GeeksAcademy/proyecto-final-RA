import React from "react";
import MiPerfil from "./miPerfil.jsx";
import SideBar from "./sideBar.jsx";
import "../../styles/components/_miperfilcontainer.css"; // Importa el archivo de estilos

export const MiPerfilContainer = () => {
    return (
        <div className="mi-perfil- container"> 
            <div className="mi-perfil-content">
                {/* <SideBar /> */}
                <MiPerfil />
            </div>
        </div>
    );
};