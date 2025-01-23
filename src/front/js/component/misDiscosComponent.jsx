// src/js/component/misDiscosComponent.jsx
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/misDiscosComponent.css";

const MisDiscosComponent = () => {
  const { store, actions } = useContext(Context);

  // Cargar los datos al montar el componente
  useEffect(() => {
    if (!store.records || store.records.length === 0) {
      actions.getRecords();
    }
  }, [store.records, actions]);

  return (
    <div className="mis-discos-container">  {/* Updated classname */}
      <h1 className="text-warning text-center mb-4">Mi Lista de Discos</h1>

      {/* Mostrar error si existe */}
      {store.error && <p className="text-danger text-center">{store.error}</p>}

      <div className="row g-3">
        {/* Mostrar los registros si están disponibles */}
        {store.records && store.records.length > 0 ? (
          store.records.map((record) => (
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
                  <h5 className="card-title text-truncate">{record.title || "Título desconocido"}</h5>
                  <p className="card-text mb-1">
                    <strong>Sello:</strong> {record.label || "Sin información"}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Año:</strong> {record.year || "Desconocido"}
                  </p>
                  <p className="card-text">
                    <strong>Género:</strong> {record.genre || "Sin género"}
                  </p>
                  {/* Botones para agregar a listas */}
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      id={`addRecordButton-${record.id}`} // Hacer el ID único
                      onClick={() => actions.addToSellList(record.id)}
                    >
                      Agregar a la lista de ventas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No hay registros disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default MisDiscosComponent;


