import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/sellListComponent.css";

const SellListComponent = () => {
    const { store, actions } = useContext(Context);
    const [deleteMessage, setDeleteMessage] = useState("");

    useEffect(() => {
        actions.getSellList();
    }, []);

    const handleDelete = async (recordId) => {
        const userId = store.user?.id;
        if (!userId) {
            setDeleteMessage("No se encontró el usuario");
            return;
        }

        const result = await actions.deleteSellListRecord(userId, recordId);

        if (!result.success) {
            setDeleteMessage(result.error);
        } else {
            setDeleteMessage(result.msg);
            actions.getSellList();
        }

        setTimeout(() => {
            setDeleteMessage("");
        }, 3000);
    };

    return (
        <div className="sell-list-component-container">
            <h1 className="sell-list-component-title text-center mb-4">
                Lista de Discos en Venta
            </h1>

            {store.error && (
                <p className="sell-list-component-error text-center">
                    {store.error}
                </p>
            )}

            <div className="row g-3">
                {store.onSale && store.onSale.length > 0 ? (
                    store.onSale.map((record) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={record.id}>
                            <div className="card h-100">
                                {record.record_cover_image && (
                                    <img
                                        src={record.record_cover_image}
                                        className="card-img-top image-fixed"
                                        alt={record.record_title || "Imagen del disco"}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title text-truncate">
                                        {record.record_title || "Título desconocido"}
                                    </h5>
                                    <p className="card-text mb-1">
                                        <strong>Sello:</strong> {record.record_label.replace(/{|}/g, "") || "Sin información"}
                                    </p>
                                    <p className="card-text mb-1">
                                        <strong>Año:</strong> {record.record_year || "Desconocido"}
                                    </p>
                                    <p className="card-text">
                                        <strong>Género:</strong> {record.record_genre.replace(/{|}/g, "") || "Sin género"}
                                    </p>
                                </div>

                                <button
                                    id={`deleteRecordButton-${record.id}`}
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(record.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No hay discos en venta.</p>
                )}
            </div>
        </div>
    );
};

export default SellListComponent;



