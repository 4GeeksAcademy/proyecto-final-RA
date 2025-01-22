import React from "react";
import MisDiscosComponent from "./misDiscosComponent.jsx";
import { Link } from "react-router-dom";

export const MisDiscos = () => {
    return (
        <div>
            <Link to={"/private"}>
            <h1>Back</h1>
            </Link>
            <MisDiscosComponent /> 
        </div>
    );
};
