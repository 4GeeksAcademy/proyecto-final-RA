import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/misDiscosComponent.css";

const MisDiscosComponent = () => {
    const { store, actions } = useContext(Context);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!store.records || store.records.length === 0) {
            actions.getRecords();
        }
    }, []);

    const userId = store.user?.id || localStorage.getItem("userId");

    if (!userId) {
        return (
            <div className="mis-discos-container py-4">
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

    return (
        <div className="mis-discos-container py-4">
            <h1 className="mis-discos-title text-warning text-center mb-4">Mi Lista de Discos</h1>

            {successMessage && (
                <div
                    className="alert alert-success mis-discos-alert text-center position-fixed top-50 start-50 translate-middle"
                    style={{
                        maxWidth: '800px',
                        width: '100%',
                        zIndex: 1050,
                        marginTop: '-50px',
                    }}
                >
                    {successMessage}
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
                                        <strong>Sello:</strong> {record.label || "Sin información"}
                                    </p>
                                    <p className="mis-discos-card-text card-text mb-1">
                                        <strong>Año:</strong> {record.year || "Desconocido"}
                                    </p>
                                    <p className="mis-discos-card-text card-text">
                                        <strong>Género:</strong> {record.genre || "Sin género"}
                                    </p>
                                    <div className="mis-discos-card-footer d-flex justify-content-between mt-3">
                                        <button
                                            id={`addRecordButton-${record.id}`}
                                            className="mis-discos-button"
                                            onClick={() => handleAddToSellList(record.id)}
                                        >
                                            Agregar a la lista de ventas
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



