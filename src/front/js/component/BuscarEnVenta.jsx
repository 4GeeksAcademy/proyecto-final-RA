import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BuscarEnVenta = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]); // Estado para almacenar los ítems de la API
  const [message, setMessage] = useState("");

  // Función para cargar los ítems desde la API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/get_all_sell`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar los ítems.");
      }
      const data = await response.json();
      setItems(data.sellList); // Asume que la API devuelve un campo "sellList"
    } catch (error) {
      setMessage("Error al cargar los ítems: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los ítems al montar el componente
  useEffect(() => {
    fetchItems();
  }, []);

  // Filtrar los ítems basados en la consulta de búsqueda
  const filteredItems = items.filter((item) => {
    const name = item.name ? item.name.toLowerCase() : '';
    const searchQuery = query ? query.toLowerCase() : '';
    return name.includes(searchQuery);
  });

  return (
    <div className="buscar-en-venta-container container my-4">
      <h1 className="buscar-en-venta-title text-center mb-4">
        Buscar Ítems en Venta
      </h1>
      <div className="buscar-en-venta-form w-50 mx-auto mb-4">
        <input
          type="text"
          className="buscar-en-venta-input form-control mb-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ítems..."
        />
      </div>

      {message && <p className="text-center text-danger">{message}</p>}

      {loading && <p className="text-center">Cargando...</p>}

      {filteredItems.length > 0 ? (
        <div className="row">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="col-12 col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={item.image || "placeholder.jpg"}
                  className="card-img-top"
                  alt={item.name || "Sin nombre"}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name || "Sin nombre"}</h5>
                  <p className="card-text">
                    <strong>Vendedor:</strong> {item.seller || "Desconocido"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default BuscarEnVenta;