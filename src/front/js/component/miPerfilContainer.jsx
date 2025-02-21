import React from "react";
import MiPerfil from "./miPerfil.jsx";
import SideBar from "./sideBar.jsx";
import "../../styles/components/_miperfilcontainer.css"; // Importa el archivo de estilos

export const MiPerfilContainer = () => {
    return (
        <div className="mi-perfil- container"> {/* Nombre de clase más descriptivo */}
            <div className="mi-perfil-content"> {/* Contenedor para SideBar y MiPerfil */}
                {/* <SideBar /> */}
                <MiPerfil />
            </div>
        </div>
    );
};