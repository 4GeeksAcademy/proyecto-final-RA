import React from "react";
import "../../styles/misDiscos.css";
import { FavoritosComponent } from "./FavoritosComponent.jsx"

export const FavoritosVista = () => {


    return (
        <div className="mis-discos-container">
            <h1>Vista de favoritos</h1>
            <FavoritosComponent />
        </div>
    )
}