import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { SearchMusic } from '../component/searchMusic.jsx';

import { RecordCarousel } from "./RecordCarousel.jsx";
import Search from "../component/search.jsx";
import { Link } from "react-router-dom";
import "../../styles/sidebar.css";

export const Private = () => {
    const { store, actions } = useContext(Context); // Acceso al contexto global
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/"); // Si no hay token, redirige a la página de inicio
            } else {
                const isValidUser = await actions.checkUser(); // Verifica al usuario
                if (!isValidUser) {
                    localStorage.removeItem("token"); // Elimina el token si no es válido
                    navigate("/"); // Redirige a la página de inicio
                }
            }
        };

        checkAuthentication();
    }, [navigate]); // Dependencias del useEffect

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Redirige al inicio tras cerrar sesión
    };

    return (
        <div className="d-flex flex-wrap">
            {/* Menú lateral */}
            <div className="sidebar bg-dark p-3 d-flex flex-column" style={{ width: '250px', position: 'fixed', height: '100vh' }}>
                <h4 className="text-warning">Menú</h4>
                <nav className="nav flex-column text-warning">
                    <Link className="nav-link text-warning" to="/mi-perfil">Mis datos</Link>
                    <Link className="nav-link text-warning" to="/mis-discos">Mis discos</Link>
                    <Link className="nav-link text-warning" to="/">Mis discos en venta</Link>
                    <Link className="nav-link text-warning" to="#">Configuración</Link>
                    <Link className="nav-link text-warning" to="#">Ayuda</Link>
                    <Link className="nav-link text-warning" to="#" onClick={handleLogout}>Cerrar sesión</Link>
                </nav>
            </div>
            <div className="content" style={{ marginLeft: '250px', padding: '20px', flex: 1 }}>
                <h2>Perfil</h2>
                <h3>del usuario</h3>
                <Search />
                
                <p>{store.user?.email || "No disponible"}</p>
                <button onClick={() => handleLogout()}>Log out</button>
            </div>
        </div>
    );
};
