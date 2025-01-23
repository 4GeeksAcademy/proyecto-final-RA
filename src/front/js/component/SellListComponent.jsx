import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const SellListComponent = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (!store.onSale || store.onSale.length === 0) {
            actions.getSellList();
        }
    }, [store.onSale, actions]);

    return (
        <div className="container py-4">
            <h1 className="text-warning text-center mb-4">Lista de Discos en Venta</h1>

            {store.error && <p className="text-danger text-center">{store.error}</p>}

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
                                    <h5 className="card-title text-truncate">{record.record_title || "Título desconocido"}</h5>
                                    <p className="card-text mb-1">
                                        <strong>Sello:</strong> {record.record_label || "Sin información"}
                                    </p>
                                    <p className="card-text mb-1">
                                        <strong>Año:</strong> {record.record_year || "Desconocido"}
                                    </p>
                                    <p className="card-text">
                                        <strong>Género:</strong> {record.record_genre || "Sin género"}
                                    </p>
                                </div>
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
