import React, { useContext, useState } from "react";
import UserProfile from "./UserProfile.jsx";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/miPerfil.css";
import { Modal } from "react-bootstrap"; // Importamos el Modal de Bootstrap

export const MiPerfil = () => {
  const { store } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    name: store.user?.name || "",
    email: store.user?.email || "",
    phone: store.user?.phone || "",
    location: store.user?.location || "",
  });

  // Verificar si hay datos del usuario antes de renderizar el perfil
  if (!store.user) {
    return <p>Cargando datos del usuario...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Aquí deberías hacer la lógica para guardar los cambios
    console.log("Datos editados:", editData);
    setShowModal(false); // Cerrar modal tras guardar cambios
  };

  return (
    <div className="mi-perfil-container">
      {/* Sidebar */}
      <div className="mi-perfil-sidebar">
        <h4 className="mi-perfil-sidebar-title">Menú</h4>
        <nav className="mi-perfil-sidebar-nav nav flex-column">
          <Link className="mi-perfil-sidebar-link nav-link" to="/mi-perfil">
            Mis datos
          </Link>
          <Link className="mi-perfil-sidebar-link nav-link" to="/mis-discos">
            Colección
          </Link>
          <Link className="mi-perfil-sidebar-link nav-link" to="#">
            Lista de deseos
          </Link>
          <Link className="mi-perfil-sidebar-link nav-link" to="/sell-list">
            Discos en venta
          </Link>
          <Link className="mi-perfil-sidebar-link nav-link" to="#">
            Configuración
          </Link>
          <Link className="mi-perfil-sidebar-link nav-link" to="#">
            Ayuda
          </Link>
          <Link
            className="mi-perfil-sidebar-link nav-link"
            to="#"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="mi-perfil-content">
        <h1>Mi Perfil</h1>
        <div className="user-profile">
          <img
            src={store.user.profileImage || "https://via.placeholder.com/150"}
            alt="Perfil"
          />
          <h2>{store.user.name}</h2>
          <p>Email: {store.user.email}</p>
          <p>Teléfono: {store.user.phone || "No disponible"}</p>
          <p>Ubicación: {store.user.location || "No disponible"}</p>
          <button className="btn btn-warning" onClick={handleShowModal}>
            Editar
          </button>
        </div>
      </div>

      {/* Modal para editar perfil */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Teléfono
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Ubicación
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={editData.location}
                onChange={handleEditChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSaveChanges}
          >
            Guardar cambios
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MiPerfil;


