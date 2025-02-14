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
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState("");


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/sell_listas`);
        if (!response.ok) throw new Error("No se pudieron cargar los ítems.");
        const data = await response.json();
        setItems(data.sellList);
        return data.sellList;
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async (itemsFromFetch) => {
      if (!store.user || !itemsFromFetch) return;
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("No se pudo obtener la wishlist.");

        const wishlistData = await response.json();
        const wishlistIds = wishlistData.map(item => item.record_id);

        // Actualiza los items con el estado de favorito
        const updatedItems = itemsFromFetch.map(item => ({
          ...item,
          isFavorite: wishlistIds.includes(item.record_id),
        }));

        setItems(updatedItems);
      } catch (error) {
        console.error("Error al obtener la wishlist:", error.message);
      }
    };

    const loadData = async () => {
      const itemsFromFetch = await fetchItems();
      await fetchWishlist(itemsFromFetch);
    };

    loadData();
  }, [store.user]);

  const handleShowModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    setExchangeRecord("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleShowCommentsModal = async (item) => {
    setSelectedItem(item);
    setShowCommentsModal(true);

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/comments/${item.record_id}`);
      if (!response.ok) throw new Error("No se pudieron cargar los comentarios.");

      const commentsData = await response.json();
      setComments((prevComments) => ({
        ...prevComments,
        [item.record_id]: commentsData,
      }));
    } catch (error) {
      console.error("Error al obtener los comentarios:", error.message);
    }
  };

  const handleCloseCommentsModal = () => {
    setShowCommentsModal(false);
    setSelectedItem(null);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowRegisterModal(true);
        return;
      }

      const response = await fetch(`${process.env.BACKEND_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          record_id: selectedItem.record_id,
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error("Error al agregar el comentario.");

      const newCommentData = await response.json();
      setComments((prevComments) => ({
        ...prevComments,
        [selectedItem.record_id]: [
          ...(prevComments[selectedItem.record_id] || []),
          newCommentData,
        ],
      }));

      setNewComment("");
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error al agregar el comentario.");
    }
  };

  const handleAddToWishlist = async (item) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowRegisterModal(true);
      return;
    }

    setAddLoading(true);
    try {
      if (item.isFavorite) {
        await actions.removeFromWishlist(item.record_id);
      } else {
        await actions.addToWishlist(item.record_id, store.user.id);
      }

      setItems(prevItems =>
        prevItems.map(prevItem =>
          prevItem.record_id === item.record_id
            ? { ...prevItem, isFavorite: !prevItem.isFavorite }
            : prevItem
        )
      );
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error al actualizar favoritos");
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
    <div className="container my-4 col-12">
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
      <div className="card-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={index} className="card-item">
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
                    <strong className="description">Género:</strong> {item.record_genre.replace(/{|}/g, "")}
                  </p>
                  <p className="card-text">
                    <strong className="description">Año:</strong> {item.record_year}
                  </p>
                  <div className="comments-section">
                    <a href="#" onClick={() => handleShowCommentsModal(item)}>Comentarios</a>
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
          <div className="no-items">No hay ítems en venta que coincidan con tu búsqueda.</div>
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
          <p><strong className="description">Género:</strong> {selectedItem?.record_genre.replace(/{|}/g, "")}</p>
          <p><strong className="description">Año:</strong> {selectedItem?.record_year.replace(/{|}/g, "")}</p>
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
          <Button variant="primary" >Intercambiar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registro o Inicio de sesión Requerido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Para agregar ítems a favoritos, debes registrarte o iniciar sesión.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={() => navigate("/register")}>Registrarse</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCommentsModal} onHide={handleCloseCommentsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Comentarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="comments-list" style={{ maxHeight: "300px", overflowY: "auto" }}>
            {comments[selectedItem?.record_id]?.map((comment, index) => (
              <div key={index} className="comment-item mb-3">
                <strong>{comment.user_name}:</strong> {comment.content}
              </div>
            ))}
          </div>
          <Form.Group className="mt-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCommentsModal}>Cerrar</Button>
          <Button variant="primary" onClick={handleAddComment}>Enviar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};