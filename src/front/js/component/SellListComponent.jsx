import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/sellListComponent.css";

const SellListComponent = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (!store.onSale || store.onSale.length === 0) {
      actions.getSellList();
    }
  }, [store.onSale, actions]);

  return (
    <div className="sell-list-component-container">
      <h1 className="sell-list-component-title text-center mb-4">Lista de Discos en Venta</h1>

      {store.error && <p className="sell-list-component-error text-center">{store.error}</p>}

      <div className="row g-3">
        {store.onSale && store.onSale.length > 0 ? (
          store.onSale.map((record) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={record.id}>
              <div className="sell-list-component-card h-100">
                {record.record_cover_image && (
                  <img
                    src={record.record_cover_image}
                    className="sell-list-component-card-img-top image-fixed"
                    alt={record.record_title || "Imagen del disco"}
                  />
                )}
                <div className="sell-list-component-card-body">
                  <h5 className="sell-list-component-card-title text-truncate">
                    {record.record_title || "Título desconocido"}
                  </h5>
                  <p className="sell-list-component-card-text mb-1">
                    <strong>Sello:</strong> {record.record_label || "Sin información"}
                  </p>
                  <p className="sell-list-component-card-text mb-1">
                    <strong>Año:</strong> {record.record_year || "Desconocido"}
                  </p>
                  <p className="sell-list-component-card-text">
                    <strong>Género:</strong> {record.record_genre || "Sin género"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="sell-list-component-empty text-center">No hay discos en venta.</p>
        )}
      </div>
    </div>
  );
};

export default SellListComponent;



