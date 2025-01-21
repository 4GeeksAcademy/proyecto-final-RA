import React from "react";
import MisDiscosComponent from "./miListaDeDiscos.jsx"; // Cambiamos el nombre de importación para evitar colisiones

export const MisDiscos = () => {
    return (
        <div>
            <h1>Mi lista de discos</h1>
            <MisDiscosComponent /> {/* Usamos el nombre actualizado */}
        </div>
    );
};
