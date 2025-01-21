import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { SearchMusic } from '../component/searchMusic.jsx';
import { UserProfile } from "./UserProfile.jsx";
import { RecordCarousel } from "./RecordCarousel.jsx";
import Search from "../component/search.jsx";
import { Link } from "react-router-dom";
import "../../styles/sidebar.css"

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
        <div className="d-flex flex-wrap">
            {/* Menú lateral */}
            <div className="sidebar bg-dark p-3 d-flex flex-column" style={{ width: '250px', position: 'fixed', height: '100vh' }}>
                <h4 className="text-warning">Menú</h4>
                <nav className="nav flex-column text-warning">
                    {/* <Link className="nav-link active text-warning" to="#">Inicio</Link> */}
                    <Link className="nav-link text-warning" to="#">Perfil</Link>
                    <Link className="nav-link text-warning" to="#">Mis discos</Link>
                    <Link className="nav-link text-warning" to="#">Configuración</Link>
                    <Link className="nav-link text-warning" to="#">Ayuda</Link>
                    <Link className="nav-link text-warning" to="#" onClick={handleLogout}>Cerrar sesión</Link>
                </nav>
            </div>
            <div className="content" style={{ marginLeft: '250px', padding: '20px', flex: 1 }}>
                <h2>Perfil</h2>
                <h3>del usuario</h3>
                <Search />
                <UserProfile />
                {/* <RecordCarousel /> */}
                <p>{store.user?.email || "No disponible"}</p>
            </div>
        </div>
    );
};
