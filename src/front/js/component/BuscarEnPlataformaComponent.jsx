import React, { useState, useEffect, useContext } from "react";
import "../../styles/buscarEnPlataformaComponent.css";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const BuscarEnPlataformaComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const { store } = useContext(Context);
  const [addLoading, setAddLoading] = useState(false);
  const navigate = useNavigate();

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

    const fetchWishlist = async () => {
      if (!store.user) return;
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener la wishlist.");
        }

        const wishlistData = await response.json();
        const wishlistIds = wishlistData.map(item => item.record_id);
        setItems(prevItems =>
          prevItems.map(item => ({
            ...item,
            isFavorite: wishlistIds.includes(item.record_id),
          }))
        );
      } catch (error) {
        console.error("Error al obtener la wishlist:", error.message);
      }
    };

    fetchItems();
    fetchWishlist();
  }, [store.user]);

  const handleAddToWishlist = async (selectedRecord) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Por favor, inicia sesión para agregar a favoritos.");
      navigate("/register");
      return;
    }

    setAddLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: store.user.id,
          record_id: selectedRecord.record_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el ítem a la lista de deseos.");
      }

      setItems(prevItems =>
        prevItems.map(item =>
          item.record_id === selectedRecord.record_id
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        )
      );
      alert("Ítem agregado a la lista de deseos.");
    } catch (error) {
      alert(error.message || "Hubo un problema al agregar el ítem.");
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  const filteredItems = items.filter(item =>
    item.record_title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container my-4 grid-ventas">
      <h1 className="text-center mb-4">Ítems en Venta</h1>
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
                  <strong>{item.user_name}</strong>
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
                  <button
                    onClick={() => handleAddToWishlist(item)}
                    className="fs-4 btn"
                    disabled={addLoading}
                  >
                    {item.isFavorite ? "❤️" : "💛"}
                  </button>
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

