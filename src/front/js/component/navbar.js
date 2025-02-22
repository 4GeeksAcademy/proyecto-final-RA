import React, { useActionState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/components/_navbar.css';
import "../../styles/RadioComponent.css";
import { Context } from "../store/appContext";
import RadioComponent from "./RadioComponent.jsx";

const Navbar = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    window.location.href = "/";
  };
  return (
    <div className="content-container">
      <nav className="navbar-container">
        <div className="container-fluid d-flex align-items-center justify-content-between">

          <Link to="/" className="navbar-brand">
            <h3 className="mb-0 p-2">Home</h3>
          </Link>

          <ul className="navbar-nav d-flex flex-row justify-content-center align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/private">Explora Música</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/buscarenrsb">Buscar en RS</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mis-discos">Mi Colección</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/vista-favoritos">Mi Lista de Deseos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sell-list">Mis Discos en Venta</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/aboutUs">About Us!</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center ms-auto">

            <div className="navbar__radio">
              <RadioComponent />
            </div>
            <div className="navbar__user pb-4 me-5">
              {store.user ? (
                <p className="navbar__user-email text-danger fw-bold pt-3">
                  <Link to="/mi-perfil-container">
                  💀 {store.user.email}
                  </Link>
                </p>
              ) : (
                <p className="navbar__user-email text-muted fw-bold pt-3">
                  💀 No disponible
                </p>
              )}
            </div>


            {store.user ? (
              <Link className="private-sidebar-link nav-link mt-4" to="#" onClick={handleLogout}>Cerrar sesión</Link>
            ) : (
              <Link to="/register">
                <button
                  type="button"
                  className="navbar__btn-login"
                  aria-label="Login or Register"
                >
                  Login / Register
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
