// src/js/component/MisDiscos.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom"
import { Context } from "../store/appContext";
import "../../styles/sideBar.css"


const SideBar = () => {
    const { store, actions } = useContext(Context);



    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="private-sidebar bg-dark p-3 d-flex flex-column">
            <nav className="private-sidebar-nav nav flex-column">
                <Link className="private-sidebar-link nav-link" to="/mi-perfil-container">Mis datos</Link>
                <Link className="private-sidebar-link nav-link" to="/mis-discos">Colección</Link>
                <Link className="private-sidebar-link nav-link" to="#">Lista de deseos</Link>
                <Link className="private-sidebar-link nav-link" to="/sell-list">Discos en venta</Link>
                <Link className="private-sidebar-link nav-link" to="#">Configuración</Link>
                <Link className="private-sidebar-link nav-link" to="#">Ayuda</Link>
                <Link className="private-sidebar-link nav-link" to="#" onClick={handleLogout}>Cerrar sesión</Link>
            </nav>
        </div>
    );
};

export default SideBar;
