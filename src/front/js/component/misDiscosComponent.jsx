import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const MisDiscosComponent = () => {
    const { store, actions } = useContext(Context);
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    useEffect(() => {
        if (!store.records || store.records.length === 0) {
            actions.getRecords();
        }
    }, [store.records, actions]);

    const userId = store.user?.id || localStorage.getItem("userId");

    if (!userId) {
        return (
            <div className="container py-4">
                <p className="text-warning text-center">
                    No se ha encontrado el ID del usuario. Por favor, inicie sesión.
                </p>
            </div>
        );
    }

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
            setDeleteMessage(result.error); // Mostrar mensaje de error
        } else {
            setDeleteMessage(result.msg); // Mostrar mensaje de éxito
        }

        setTimeout(() => {
            setDeleteMessage("");
        }, 3000);
    };

    return (
        <div className="container py-4">
            <h1 className="text-warning text-center mb-4">Mi Lista de Discos</h1>

            {successMessage && (
                <div
                    className="alert alert-success text-center position-fixed top-50 start-50 translate-middle z-index-1050"
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
                <div className="row g-3">
                    {store.records.map((record) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={record.id}>
                            <div className="card h-100">
                                {record.cover_image && (
                                    <img
                                        src={record.cover_image}
                                        className="card-img-top image-fixed"
                                        alt={record.title || "Imagen del disco"}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title text-truncate">
                                        {record.title || "Título desconocido"}
                                    </h5>
                                    <p className="card-text mb-1">
                                        <strong>Sello:</strong> {record.label || "Sin información"}
                                    </p>
                                    <p className="card-text mb-1">
                                        <strong>Año:</strong> {record.year || "Desconocido"}
                                    </p>
                                    <p className="card-text">
                                        <strong>Género:</strong> {record.genre || "Sin género"}
                                    </p>
                                    <div className="d-flex justify-content-between mt-3">
                                        <button
                                            id={`addRecordButton-${record.id}`}
                                            className="btn btn-primary"
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
        </div>
    );
};

export default MisDiscosComponent;
