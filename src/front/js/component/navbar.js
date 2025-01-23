import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css"

const Navbar = () => {

  return (
    <nav className="navbar-container"> 
      <div className="container-fluid d-flex">
        <Link to="/" className="navbar-brand">
          <h3 className="mb-0 text-warning p-2 flex-grow-1">Home</h3>
        </Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ml-auto">
					<li className="nav-item">
							<Link className="nav-link" to={"/private"}>
								Mi perfil
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={"/searchworldwide"}>
								Search Worldwide
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={"/"}>
								Search Local
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={"/aboutUs"}>
								About Us!
							</Link>
						</li>
					</ul>
				</div>
				<Link to={"/register"}>
					<button type="button" className="btn btn-dark btn-login">Login / Register</button>
				</Link>
			</div>
		</nav>
	);
};


export default Navbar;