import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Search from "../component/search.jsx";
import "../../styles/private.css";
import RecordCarousel from "./RecordCarousel.jsx";
import { Link } from "react-router-dom";

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
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="private-page-container d-flex flex-wrap">
            <div className="private-sidebar bg-dark p-3 d-flex flex-column">
                <h4 className="private-sidebar-title">Menú</h4>
                <nav className="private-sidebar-nav nav flex-column">
                    <Link className="private-sidebar-link nav-link" to="/mi-perfil">Mis datos</Link>
                    <Link className="private-sidebar-link nav-link" to="/mis-discos">Colección</Link>
                    <Link className="private-sidebar-link nav-link" to="#">Lista de deseos</Link>
                    <Link className="private-sidebar-link nav-link" to="/sell-list">Discos en venta</Link>
                    <Link className="private-sidebar-link nav-link" to="#">Configuración</Link>
                    <Link className="private-sidebar-link nav-link" to="#">Ayuda</Link>
                    <Link className="private-sidebar-link nav-link" to="#" onClick={handleLogout}>Cerrar sesión</Link>
                </nav>
            </div>
            <div className="private-content">
                <h2 className="private-content-title">Perfil</h2>
                <h3 className="private-content-subtitle">del usuario</h3>
                <div className="search-container">
                    <Search />
                </div>
                <p>{store.user?.email || "No disponible"}</p>
                <button className="private-content-btn" onClick={handleLogout}>Log out</button>
            </div>
        </div>
    );
};

export default Private;

