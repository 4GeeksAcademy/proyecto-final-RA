import React, { Component } from "react";
// import "../../styles/footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <p>&copy; {new Date().getFullYear()} Record Swappers Blog. Todos los derechos reservados.</p>
      <ul className="footer-nav">
        <li><a href="/about" className="footer-dark">Acerca de</a></li>
        <li><a href="/privacy" className="footer-dark">Política de Privacidad</a></li>
        <li><a href="/contact" className="footer-dark">Contacto</a></li>
      </ul>
    </div>
  </footer>

);

export default Footer;