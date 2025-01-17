import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { UserProfile } from "./UserProfile.jsx"

export const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
            } else {
                const isValidUser = await actions.checkUser();
                if (!isValidUser) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
            }
        };

        checkAuthentication();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="private-view">
            <h2>Perfil</h2>
            <h3>del usuario</h3>
            <UserProfile /> 
            <p>{store.user?.email || "No disponible"}</p>
            <button className="logout" onClick={handleLogout}>Cerrar Sesión</button>

 
            
        </div>
    );
};
