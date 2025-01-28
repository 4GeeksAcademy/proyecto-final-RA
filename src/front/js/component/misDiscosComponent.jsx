import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/misDiscosComponent.css";
import { Modal, Button } from "react-bootstrap";

const MisDiscosComponent = () => {
    const { store, actions } = useContext(Context);
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");
    const [showAuthModal, setShowAuthModal] = useState(false); // Estado del modal de autenticación

    useEffect(() => {
        if (!store.records || store.records.length === 0) {
            actions.getRecords();
        }
    }, [store.records, actions]);

    const userId = store.user?.id || localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) {
            setShowAuthModal(true); // Mostrar el modal si no hay usuario autenticado
        }
    }, [userId]);

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
        const result = await actions.deleteRecord(userId, recordId);

        if (!result.success) {
            setDeleteMessage(result.error);
        } else {
            setDeleteMessage(result.msg);
        }

        setTimeout(() => {
            setDeleteMessage("");
        }, 3000);
    };

    const handleAuthRedirect = () => {
        setShowAuthModal(false);
        actions.redirectToLogin();
    };

    return (
        <div className="mis-discos-container py-4">
            <h1 className="mis-discos-title text-warning text-center mb-4">Mi Lista de Discos</h1>

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
                    className="alert alert-danger text-center position-fixed top-50 start-50 translate-middle z-index-1050"
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
                <div className="mis-discos-row row g-3">
                    {store.records.map((record) => (
                        <div className="mis-discos-col col-12 col-sm-6 col-md-4 col-lg-3" key={record.id}>
                            <div className="mis-discos-card card h-100">
                                {record.cover_image && (
                                    <img
                                        src={record.cover_image}
                                        className="mis-discos-card-img card-img-top"
                                        alt={record.title || "Imagen del disco"}
                                    />
                                )}
                                <div className="mis-discos-card-body card-body">
                                    <h5 className="mis-discos-card-title card-title text-truncate">
                                        {record.title || "Título desconocido"}
                                    </h5>
                                    <p className="mis-discos-card-text card-text mb-1">
                                        <strong>Sello:</strong> {record.label.replace(/{|}/g, "") || "Sin información"}
                                    </p>
                                    <p className="mis-discos-card-text card-text mb-1">
                                        <strong>Año:</strong> {record.year || "Desconocido"}
                                    </p>
                                    <p className="mis-discos-card-text card-text">
                                        <strong>Género:</strong> {record.genre.replace(/{|}/g, "") || "Sin género"}
                                    </p>
                                    <div className="mis-discos-card-footer d-flex justify-content-between mt-3">
                                        <button
                                            id={`addRecordButton-${record.id}`}
                                            className="mis-discos-button"
                                            onClick={() => handleAddToSellList(record.id)}
                                        >
                                            Agregar a la lista de ventas
                                        </button>
                                        <button
                                            id={`deleteRecordButton-${record.id}`}
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(record.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de autenticación */}
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
                    <Button variant="primary" onClick={handleAuthRedirect}>
                        Iniciar Sesión
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MisDiscosComponent;



