import React from "react";
import "../../styles/misDiscos.css";
import { FavoritosComponent } from "./FavoritosComponent.jsx"
import SideBar from "./sideBar.jsx"
import "../../styles/sideBar.css"

export const FavoritosVista = () => {


    return (
        <div className="mis-discos-container">
            <SideBar />
            <FavoritosComponent />
        </div>
    )
}