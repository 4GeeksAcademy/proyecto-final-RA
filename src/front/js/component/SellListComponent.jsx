import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/components/_sellListComponent.css";

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
    <div className="container py-4 col-12">
      <h1 className="mis-discos-title text-warning text-center mb-4">
        Lista de Discos en Venta
      </h1>

      {store.error && (
        <p className="text-danger text-center">{store.error}</p>
      )}

      {deleteMessage && (
        <div
          className="alert alert-danger mis-discos-alert text-center position-fixed top-50 start-50 translate-middle"
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

      {store.onSale && store.onSale.length > 0 ? (
        <div className="row g-3">
          {store.onSale.map((record) => (
            <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-4" key={record.id}>
              <div className="card bg-dark text-white h-100">
                {record.record_cover_image && (
                  <img
                    src={record.record_cover_image}
                    className="card-img-top"
                    alt={record.record_title || "Imagen del disco"}
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title text-truncate">
                    {record.record_title || "Título desconocido"}
                  </h5>
                  <div className="card-text small">
                    <p className="mb-1 text-truncate">
                      <strong>Sello:</strong>{" "}
                      {record.record_label.replace(/{|}/g, "") || "Sin información"}
                    </p>
                    <p className="mb-1">
                      <strong>Año:</strong> {record.record_year || "Desconocido"}
                    </p>
                    <p>
                      <strong>Género:</strong>{" "}
                      {record.record_genre.replace(/{|}/g, "") || "Sin género"}
                    </p>
                  </div>
                </div>
                <div className="card-footer bg-dark border-top-0">
                  <div className="d-grid gap-2">
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
          ))}
        </div>
      ) : (
        <p className="text-center w-100">No hay discos en venta.</p>
      )}
    </div>
  );
};

export default SellListComponent;
