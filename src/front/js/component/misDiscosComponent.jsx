import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const MisDiscosComponent = () => {
  const { store, actions } = useContext(Context);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      if (!store.records || store.records.length === 0) {
        await actions.getRecords();
      }
    };
    fetchRecords();
  }, []);

  const userId = store.user?.id || localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
    }
  }, []);

  const handleAddToSellList = async (recordId) => {
    try {
      await actions.addToSellList(userId, recordId);
      setSuccessMessage("¡Disco agregado correctamente a la lista de ventas!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al agregar el disco a la lista de ventas:", error);
    }
  };

  const handleDelete = async (recordId) => {
    try {
      const result = await actions.deleteRecord(userId, recordId);
      if (!result.success) {
        setDeleteMessage(result.error);
      } else {
        setDeleteMessage(result.msg);
      }
      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al eliminar el disco:", error);
      setDeleteMessage("Error al eliminar el disco.");
      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
    }
  };

  return (
    <div className="container">
      <h1 className="search-title text-warning text-center mb-4">Mi Lista de Discos</h1>

      {successMessage && (
        <div
          className="alert alert-success mis-discos-alert text-center position-fixed top-50 start-50 translate-middle"
          style={{
            maxWidth: "800px",
            width: "100%",
            zIndex: 1050,
            marginTop: "-50px",
          }}
        >
          {successMessage}
        </div>
      )}

      {deleteMessage && (
        <div
          className="alert alert-danger text-center position-fixed top-50 start-50 translate-middle"
          style={{
            maxWidth: "800px",
            width: "100%",
            zIndex: 1050,
            marginTop: "-50px",
          }}
        >
          {deleteMessage}
        </div>
      )}

      {store.error && <p className="text-danger text-center">{store.error}</p>}

      {store.records === null ? (
        <p className="text-center">Cargando registros...</p>
      ) : store.records.length === 0 ? (
        <p className="text-center">No hay registros disponibles.</p>
      ) : (
        <div className=" row">
          {store.records.map((record) => (
            <div className="col-12 col-md-2 mb-4" key={record.id}>
              <div className="card bg-dark text-white h-100">
                {record.cover_image && (
                  <img
                    src={record.cover_image}
                    className="card-img-top"
                    alt={record.title || "Imagen del disco"}
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title text-truncate">
                    {record.title || "Título desconocido"}
                  </h5>
                  <div className="card-text small">
                    <p className="mb-1 text-truncate">
                      <strong>Sello:</strong> {record.label.replace(/{|}/g, "")}
                    </p>
                    <p className="mb-1">
                      <strong>Año:</strong> {record.year || "Desconocido"}
                    </p>
                    <p>
                      <strong>Género:</strong> {record.genre.replace(/{|}/g, "")}
                    </p>
                  </div>
                  <div className="card-footer bg-dark border-top-0">
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToSellList(record.id)}
                      >
                        Agregar a ventas
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(record.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showAuthModal} onHide={() => setShowAuthModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Autenticación Requerida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Por favor, regístrese o inicie sesión para acceder a sus discos.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAuthModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => navigate("/register")}>
            Iniciar Sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MisDiscosComponent;
