import React, { useState, useEffect, useContext } from "react";
import "../../styles/buscarEnPlataformaComponent.css";
import { Context } from "../store/appContext";

export const BuscarEnPlataformaComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(""); // Estado para la búsqueda
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

  // Filtrar los ítems en base a la consulta
  const filteredItems = items.filter((item) => {
    const itemName = item.record_title ? item.record_title.toLowerCase() : '';
    const searchQuery = query.toLowerCase();
    return itemName.includes(searchQuery);
  });

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-4 grid-ventas">
      <h1 className="text-center mb-4">Ítems en Venta</h1>

      {/* Campo de búsqueda */}
      <div className="search-container mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar ítems"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={index} className="col-12 col-md-4 mb-4">
              <div className="card">
                <div className="card-header">
                  <div className="avatar-container">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <strong>{item.user_name}</strong> <br />
                </div>

                <img
                  src={item.record_cover_image || "placeholder.jpg"}
                  className="card-img-top"
                  alt={item.record_title}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.record_title}</h5>
                  <p className="card-text">
                    <strong>Género:</strong> {item.record_genre.replace(/{|}/g, "")}
                  </p>
                  <p className="card-text">
                    <strong>Año:</strong> {item.record_year}
                  </p>
                </div>

                <div className="card-footer text-center">
                  <button className="btn btn-primary">Ver más</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">No hay ítems en venta que coincidan con tu búsqueda.</div>
        )}
      </div>
    </div>
  );
};

