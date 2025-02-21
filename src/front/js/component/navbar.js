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
    // Elimina el token y cualquier otro dato persistente si fuera necesario
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Ejemplo: elimina datos del usuario si los guardas
  
    // Redirige y recarga la página para limpiar el estado de la aplicación
    window.location.href = "/";
  };
  return (
    <div className="content-container">
      <nav className="navbar-container">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo Home */}
          <Link to="/" className="navbar-brand">
            <h3 className="mb-0 p-2">Home</h3>
          </Link>
          {/* Menú de enlaces */}
          <ul className="navbar-nav d-flex flex-row justify-content-center align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/private">Explora Música</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/buscarenrsb">Buscar en RSB</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mis-discos">Colección</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/vista-favoritos">Lista de deseos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sell-list">Discos en venta</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/aboutUs">About Us!</Link>
            </li>
          </ul>
          {/* Contenedor flexible para la radio y el botón */}
          <div className="d-flex align-items-center ms-auto">
            {/* Reproductor de radio */}
            <div className="navbar__radio">
              <RadioComponent />
            </div>
            {/* Mostrar email del usuario si está autenticado */}
            {/* Mostrar email del usuario si está autenticado */}
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

            {/* Botón: si el usuario está logeado, muestra Logout; si no, Login / Register */}
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
