import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg shadow">
		<div className="container-fluid-fluid d-flex">
		  <Link to="/" className="navText ">
			  <h1 className="mb-0 text-warning p-2 flex-grow-1">Home</h1>
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
		  <div className="App collapse navbar-collapse float-end" id="navbarNav">
			<ul className="navbar-nav d-inline-flex p-2 justify-content-end">
			  <li className="nav-item p-2 ">
				<Link className="nav-link navText " to={"/"}>
				  User Collections
				</Link>
			  </li>
			  <li className="nav-item p-2">
				<Link className="nav-link navText" to={"/aboutUs"}>
				  About Us!
				</Link>
			  </li>
			</ul>
		  </div>
		</div>
		<Link to={"/register"}>
			<button type="button" class="btn btn-dark">Log in</button>
		</Link>
	  </nav>
	);
};
