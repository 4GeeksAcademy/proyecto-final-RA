import React, { useState, useEffect, useContext } from "react";
import "../../styles/buscarEnPlataformaComponent.css";
import { Context } from "../store/appContext";

export const BuscarEnPlataformaComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { store, actions } = useContext(Context);




  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/sell_listas`);
        if (!response.ok) {
          throw new Error("No se pudieron cargar los ítems.");
        }
        const data = await response.json();
        setItems(data.sellList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-4 grid-ventas">
      <h1 className="text-center mb-4">Ítems en Venta</h1>

      <div className="row">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="col-12 col-md-4 mb-4">
              <div className="card">
                <div className="card-header">
                  {/* Aquí mostramos el user_name, pero podemos añadir el avatar con una imagen */}
                  <div className="avatar-container">
                  <i class="fa-solid fa-user"></i>
                  </div>
                  <strong>{item.user_name}</strong> <br />
                  {/* <small>Email: {item.user_email}</small> */}
                </div>

                {/* Imagen y detalles del ítem */}
                <img
                  src={item.record_cover_image || "placeholder.jpg"}
                  className="card-img-top"
                  alt={item.record_title}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.record_title}</h5>
                  <p className="card-text">
                    <strong>Género:</strong> {item.record_genre.replace(/{|}/g, "")} {/* Limpiar las llaves del género */}
                  </p>
                  <p className="card-text">
                    <strong>Año:</strong> {item.record_year}
                  </p>
                </div>

                {/* Footer de la tarjeta */}
                <div className="card-footer text-center">
                  <button className="btn btn-primary">Ver más</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">No hay ítems en venta en este momento.</div>
        )}
      </div>
    </div>
  );
};
