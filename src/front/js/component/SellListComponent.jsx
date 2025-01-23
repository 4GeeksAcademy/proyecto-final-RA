import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/sellListComponent.css";

const SellListComponent = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    // Cargar los discos en venta cuando el componente se monta
    if (!store.onSale || store.onSale.length === 0) {
      actions.getSellList(); // Llamar a la acción para obtener los discos en venta
    }
  }, [store.onSale, actions]);

  return (
    <div className="sell-list-container">
      <h1 className="sell-list-title text-center mb-4">Lista de Discos en Venta</h1>

      {/* Mostrar error si existe */}
      {store.error && <p className="sell-list-error text-center">{store.error}</p>}

      <div className="sell-list-grid row g-3">
        {/* Mostrar los discos en venta */}
        {store.onSale && store.onSale.length > 0 ? (
          store.onSale.map((record) => (
            <div className="sell-list-item col-12 col-sm-6 col-md-4 col-lg-3" key={record.id}>
              <div className="card h-100">
                {record.record_cover_image && (
                  <img
                    src={record.record_cover_image}
                    className="card-img-top sell-list-image"
                    alt={record.record_title || "Imagen del disco"}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title text-truncate sell-list-record-title">
                    {record.record_title || "Título desconocido"}
                  </h5>
                  <p className="card-text mb-1 sell-list-record-detail">
                    <strong>Sello:</strong> {record.record_label || "Sin información"}
                  </p>
                  <p className="card-text mb-1 sell-list-record-detail">
                    <strong>Año:</strong> {record.record_year || "Desconocido"}
                  </p>
                  <p className="card-text sell-list-record-detail">
                    <strong>Género:</strong> {record.record_genre || "Sin género"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="sell-list-empty text-center">No hay discos en venta.</p>
        )}
      </div>
    </div>
  );
};

export default SellListComponent;


