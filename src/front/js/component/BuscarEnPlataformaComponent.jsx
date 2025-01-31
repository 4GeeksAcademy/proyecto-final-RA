import React, { useState, useEffect, useContext } from "react";
import "../../styles/buscarEnPlataformaComponent.css";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

export const BuscarEnPlataformaComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const { store, actions } = useContext(Context);
  const [addLoading, setAddLoading] = useState(false);
  const navigate = useNavigate();
  const [comments, setComments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [exchangeRecord, setExchangeRecord] = useState("");

  useEffect(() => {
    actions.getSellList();
  }, []);


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

  const handleAddComment = (record_id, newComment) => {
    if (!newComment.trim()) return;

    setComments(prevComments => ({
      ...prevComments,
      [record_id]: [...(prevComments[record_id] || []), newComment]
    }));
  };

  const handleShowModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    setExchangeRecord("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleExchangeRecord = async () => {
    if (!exchangeRecord) {
      alert("Por favor, selecciona un disco para intercambiar.");
      return;
    }


    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/exchange_record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user_id: store.user.id,
          selected_record_id: selectedItem.record_id,
          exchange_record_id: exchangeRecord,
        }),
      });

      console.log(response, "EXCHANGEEEEEE")

      if (!response.ok) {
        throw new Error("Error al realizar el intercambio.");
      }


      alert("Intercambio realizado con éxito.");
      setShowModal(false);
    } catch (error) {
      alert(error.message || "Hubo un problema al realizar el intercambio.");
    }
  };


  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;


  const filteredItems = items.filter(item =>
    item.record_title.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddToWishlist = async (item) => {
    setAddLoading(true);
  
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/wishlist`, {
        method: item.isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          record_id: item.record_id,
        }),
      });
      console.log(response, "<========")
  
      if (!response.ok) {
        throw new Error("No se pudo actualizar la wishlist.");
      }
  
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.record_id === item.record_id
            ? { ...prevItem, isFavorite: !prevItem.isFavorite }
            : prevItem
        )
      );
    } catch (error) {
      console.error("Error al actualizar la wishlist:", error.message);
    } finally {
      setAddLoading(false);
    }
  };
  





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
                  <div className="comments-section">
                    <input
                      type="text"
                      placeholder="Escribe un comentario"
                      onBlur={(e) => handleAddComment(item.record_id, e.target.value)}
                    />
                    <div>
                      {comments[item.record_id] && comments[item.record_id].map((comment, idx) => (
                        <p key={idx}>{comment}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card-footer text-center">
                  <button className="btn btn-primary" onClick={() => handleShowModal(item)}>Ver más</button>
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.record_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem?.record_cover_image && (
            <img
              src={selectedItem.record_cover_image}
              alt={selectedItem.record_title}
              className="img-fluid mb-3"
            />
          )}
          <p><strong>Género:</strong> {selectedItem?.record_genre.replace(/{|}/g, "")}</p>
          <p><strong>Año:</strong> {selectedItem?.record_year.replace(/{|}/g, "")}</p>
          <Form.Group controlId="exchangeRecord">
            <Form.Label>Selecciona un ítem para intercambiar</Form.Label>
            <Form.Control as="select" value={exchangeRecord} onChange={(e) => setExchangeRecord(e.target.value)}>
              <option value="">Selecciona un ítem...</option>
              {store.onSale && store.onSale.length > 0 ? (
                store.onSale.map((record) => (
                  <option key={record.record_id} value={record.record_id}>
                    {record.record_title}
                  </option>
                ))
              ) : (
                <option>No tienes ítems en venta.</option>
              )}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
          <Button variant="primary" onClick={handleExchangeRecord}>Intercambiar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
