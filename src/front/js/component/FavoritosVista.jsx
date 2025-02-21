import React, { useContext, useEffect } from "react";
// import "../../styles/misDiscosComponent.css";
import { FavoritosComponent } from "./FavoritosComponent.jsx"
import SideBar from "./sideBar.jsx"
// import "../../styles/sideBar.css"
import { Context } from "../store/appContext";
import { actions } from '../store/flux.js';
// import "../../styles/components/_private.css";

export const FavoritosVista = () => {
    return (
        <>
        <div className="container d-flex flex-wrap align-item-center">
            <div className=" ">
            {/* <SideBar /> */}
                <FavoritosComponent />
            </div>
        </div>
        </>
    )
}