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
            {/* <div className="private-sidebar bg-dark p-3 d-flex flex-column">
                <h4 className="private-sidebar-title text-warning">Menú</h4>
                <nav className="private-sidebar-nav nav flex-column text-warning">
                    <Link className="private-sidebar-link nav-link text-warning" to="/mi-perfil">Mis datos</Link>
                    <Link className="private-sidebar-link nav-link text-warning" to="/mis-discos">Colección</Link>
                    <Link className="private-sidebar-link nav-link text-warning" to="#">Lista de deseos</Link>
                    <Link className="private-sidebar-link nav-link text-warning" to="/sell-list">Discos en venta</Link>
                    <Link className="private-sidebar-link nav-link text-warning" to="#">Configuración</Link>
                    <Link className="private-sidebar-link nav-link text-warning" to="#">Ayuda</Link>
                    <Link className="private-sidebar-link nav-link text-warning" to="#" onClick={handleLogout}>Cerrar sesión</Link>
                </nav>
            </div> */}
            <div className="private-content" style={{ marginLeft: '250px', padding: '20px', flex: 1 }}>
                <h2 className="private-content-title">Perfil</h2>
                <h3 className="private-content-subtitle">del usuario</h3>
                <Search />
                <p>{store.user?.email || "No disponible"}</p>
                <button className="private-content-btn" onClick={handleLogout}>Log out</button>
            </div>
        </div>
    );
};

export default Private;

