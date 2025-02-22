import React, { useContext, useEffect } from "react";
import { FavoritosComponent } from "./FavoritosComponent.jsx"
import SideBar from "./sideBar.jsx"
import { Context } from "../store/appContext";
import { actions } from '../store/flux.js';


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