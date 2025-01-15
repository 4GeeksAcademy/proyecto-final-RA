import React, { Component } from "react";
import "../../styles/footer.css";

export const Footer = () => (
	<footer className="container-fluid col-12 m-0 footer mt-5">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Street Records. Todos los derechos reservados.</p>
        <ul className="footer-nav">
          <li><a href="/about" className="footer-dark">Acerca de</a></li>
          <li><a href="/privacy" className="footer-dark">Política de Privacidad</a></li>
          <li><a href="/contact" className="footer-dark">Contacto</a></li>
        </ul>
      </div>
    </footer>
);
