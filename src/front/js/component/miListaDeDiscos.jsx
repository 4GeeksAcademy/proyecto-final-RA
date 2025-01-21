import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const MisDiscosComponent = () => {
    const { store, actions } = useContext(Context); // Acceso al contexto global

    // Cargar los datos al montar el componente
    useEffect(() => {
        if (!store.records || store.records.length === 0) {
            actions.getRecords(); // Llamar a la acción para obtener los registros si no están en el store
        }
    }, [store.records, actions]);

    return (
        <div>
            <h1 className="text-warning">Mi Lista</h1>

            {/* Mostrar error si existe */}
            {store.error && <p style={{ color: 'red' }}>{store.error}</p>}

            <div>
                {/* Mostrar los registros si están disponibles */}
                {store.records && store.records.length > 0 ? (
                    store.records.map((record) => (
                        <div key={record.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
                            <h2>{record.title || "Título desconocido"}</h2>
                            <p><strong>Sello:</strong> {record.label || "Sin información"}</p>
                            <p><strong>Año:</strong> {record.year || "Desconocido"}</p>
                            <p><strong>Género:</strong> {record.genre || "Sin género"}</p>
                            {record.cover_image && (
                                <img
                                    src={record.cover_image}
                                    alt={record.title || "Imagen del disco"}
                                    style={{ width: "150px", height: "150px" }}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    // Mostrar mensaje si no hay registros disponibles
                    <p>No hay registros disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default MisDiscosComponent;


