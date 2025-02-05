import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/jumbotron.css"; 

export const Jumbotron = () => {
  const navigate = useNavigate();

  return (
    <div className="jumbotron">
      <div className="jumbotron-content">
        <h1>Bienvenido a nuestra plataforma de intercambio de discos Record Swappers</h1>
        <p className="lead">
          Descubre, intercambia y conecta con otros amantes de la música. Aquí puedes encontrar una amplia colección de discos en venta o intercambio, agregar tus favoritos y dejar comentarios en las publicaciones.
        </p>
        <hr className="my-4" />
        <p>
          <strong className="lead">¿Cómo funciona?</strong>
        </p>
        <ul>
          <li>🔍 <strong>Busca discos</strong>: Utiliza el buscador para encontrar tus álbumes favoritos por título, género o año.</li>
          <li>💬 <strong>Comenta y conecta</strong>: Deja comentarios en las publicaciones y conéctate con otros usuarios.</li>
          <li>❤️ <strong>Agrega a favoritos</strong>: Guarda tus discos favoritos para acceder a ellos fácilmente.</li>
          <li>🔄 <strong>Intercambia</strong>: Ofrece tus discos para intercambio y encuentra nuevas joyas musicales.</li>
        </ul>
        <div className="cta-buttons">
          <Button variant="danger" size="lg" onClick={() => navigate("/register")}>
            Regístrate o Iinicia sesion
          </Button>
        </div>
      </div>
    </div>
  );
};