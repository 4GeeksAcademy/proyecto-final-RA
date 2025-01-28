import React, { useState, useEffect } from "react";


export const BuscarEnPlataformaComponent = () => {
    const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener todos los ítems en venta
    const fetchItems = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/items_en_venta`);
        if (!response.ok) {
          throw new Error("No se pudieron cargar los ítems.");
        }
        const data = await response.json();
        setItems(data);
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
        <div className="container my-4">
        <h1 className="text-center mb-4">Ítems en Venta</h1>
  
        <div className="row">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={index} className="col-12 col-md-4 mb-4">
                <div className="card">
                  {/* Cabecera de la tarjeta con nombre de usuario y correo */}
                  <div className="card-header">
                    <strong>{item.username}</strong> <br />
                    <small>{item.email}</small>
                  </div>
  
                  {/* Imagen y detalles del ítem */}
                  <img
                    src={item.cover_image || "placeholder.jpg"}
                    className="card-img-top"
                    alt={item.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">
                      <strong>Precio:</strong> {item.price} USD
                    </p>
                    <p className="card-text">
                      <strong>Descripción:</strong> {item.description || "No disponible"}
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


    )
}

