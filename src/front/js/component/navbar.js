import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import "../../styles/RadioComponent.css"; // ✅ Se separan los estilos de la radio
import { Context } from "../store/appContext";
import RadioComponent from "./RadioComponent.jsx"; // ✅ Se mantiene el reproductor de radio

const Navbar = () => {
  const { store } = useContext(Context);

  return (
    <div className="content-container">
      <nav className="navbar-container">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          
          {/* Logo Home */}
          <Link to="/" className="navbar-brand">
            <h3 className="mb-0 p-2">Home</h3>
          </Link>

          {/* ✅ Restauramos la posición original de los enlaces */}
          <ul className="navbar-nav d-flex flex-row justify-content-center align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/private">Mi perfil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/buscarenrsb">Buscar en RSB</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aboutUs">About Us!</Link>
            </li>
          </ul>

          {/* ✅ Contenedor flexible para la radio y el botón de login */}
          <div className="d-flex align-items-center ms-auto">
            {/* 🎵 Reproductor de radio alineado correctamente */}
            <div className="radio-navbar-container">
              <RadioComponent />
            </div>

            {/* Botón de Login / Register */}
            <Link to="/register">
              <button type="button" className="btn-login">
                Login / Register
              </button>
            </Link>
          </div>

          {/* Mostrar email del usuario si está autenticado */}
          <div>
            <p className="text-danger fw-bold pt-3">💀{store.user?.email || "No disponible"}</p>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;






