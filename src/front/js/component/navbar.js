import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";

const Navbar = () => {
  const { store, actions } = useContext(Context);
  return (
    <div className="content-container">
      <nav className="navbar-container">
        <div className="container-fluid d-flex align-items-center">
          <Link to="/" className="navbar-brand">
            <h3 className="mb-0 p-2">Home</h3>
          </Link>
          <ul className="navbar-nav d-flex flex-row justify-content-center align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/private">
                Mi perfil
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/searchworldwide">
                Search Worldwide
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search-local">
                Search Local
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aboutUs">
                About Us!
              </Link>
            </li>
          </ul>
          
            <Link to="/register" className="ms-auto">
              <button type="button" className="btn-login">
                Login / Register
              </button>
            </Link>
            <div>
              <p>💀{store.user?.email || "No disponible"}</p>
            </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

