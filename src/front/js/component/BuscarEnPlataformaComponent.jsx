import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "../../styles/components/_buscarEnPlataforma.css";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [userRecords, setUserRecords] = useState([]);



  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  
      handleAddComment();  
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/get_all_sell_list`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("No se pudieron cargar los ítems.");
        const data = await response.json();
        setItems(data.sellList);
        return data.sellList;
      } catch (error) {
        setError(error.message);
        return [];
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

  useEffect(() => {
    actions.getSellList();
  }, []);

  
  const handleShowModal = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowRegisterModal(true);
      return;
    }
    setSelectedItem(item);
    setShowModal(true);
    setExchangeRecord("");

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/user_records`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("URL llamada:", `${process.env.BACKEND_URL}/api/user_records`);
      console.log("Status code:", response.status);
      console.log("Response headers:", response.headers);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        throw new Error(`Respuesta inválida: ${textResponse.substring(0, 100)}...`);
      }

      if (!response.ok) throw new Error("Error al cargar discos");
      const data = await response.json();
      setUserRecords(data);
    } catch (error) {
      console.error("Error completo:", error);
      if (error.message.includes("401")) {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        alert(`Error: ${error.message}`);
      }
    }
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
          ...(Array.isArray(prevComments[selectedItem.record_id]) ? prevComments[selectedItem.record_id] : []),
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
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
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

  
  const handlePurchase = async (recordId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowRegisterModal(true);
      return;
    }
    try {
      setPaymentStatus("processing");
      setShowPaymentModal(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPaymentStatus("validating");
    
      const response = await fetch(`${process.env.BACKEND_URL}/api/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ record_id: recordId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error en la compra");
      }

      setItems((prev) => prev.filter((item) => item.record_id !== recordId));
  
      if (actions.getRecords) {
        await actions.getRecords();
      }
      if (actions.getSellList) {
        await actions.getSellList();
      }
    
      setPaymentStatus("success");
      setTimeout(() => setShowPaymentModal(false), 2000);
    } catch (error) {
      setPaymentStatus("failed");
      console.error("Error en la compra:", error);
      alert(error.message || "Error al procesar la compra");
      setTimeout(() => setShowPaymentModal(false), 3000);
    }
  };


  const handleExchange = async () => {
    if (!selectedItem || !exchangeRecord) {
      alert("Selecciona ambos discos para el intercambio");
      return;
    }
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/exchange`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          target_record_id: selectedItem.record_id,
          offered_record_id: exchangeRecord,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error en el intercambio");
      }
      setItems((prev) =>
        prev.filter(
          (item) =>
            item.record_id !== selectedItem.record_id &&
            item.record_id !== exchangeRecord
        )
      );
      alert("¡Intercambio solicitado con éxito!");
      handleCloseModal();
    } catch (error) {
      console.error("Detalles completos del error:", {
        error: error.message,
        stack: error.stack,
      });
      alert(`Error: ${error.message}`);
    }
  };


  const PaymentModal = () => (
    <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {paymentStatus === "success"
            ? "¡Compra exitosa!"
            : paymentStatus === "failed"
              ? "Error en pago"
              : "Procesando pago"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {paymentStatus === "processing" && (
          <div>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Procesando tu transacción...</p>
          </div>
        )}
        {paymentStatus === "success" && (
          <div>
            <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
            <p>¡Transacción completada con éxito!</p>
            <p>El disco será enviado a tu dirección registrada.</p>
          </div>
        )}
        {paymentStatus === "failed" && (
          <div>
            <i className="fas fa-times-circle fa-3x text-danger mb-3"></i>
            <p>Error al procesar el pago</p>
            <p>Por favor intenta nuevamente.</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowPaymentModal(false)}
          disabled={paymentStatus === "processing"}
        >
          {paymentStatus === "processing" ? "Procesando..." : "Cerrar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const filteredItems = items.filter((item) =>
    item.record_title.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="search-container container d-flex flex-column align-items-center my-4">
      <h1 className="search-title text-center mb-4">Ítems en Venta</h1>
      <h2>Descubre Artistas alrededor del mundo!</h2>
      <p>
        Explora música de todos los rincones del planeta y encuentra tus nuevos
        artistas favoritos.
      </p>
      <div className="search-form w-50 d-flex flex-column align-items-center mb-4">
        <input
          type="text"
          className="search-input form-control"
          placeholder="Buscar ítems"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="row w-100 g-3 py-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3 col-xl-2 mb-4">
              <div className="card bg-dark text-white h-100">
                <img
                  src={item.record_cover_image || "placeholder.jpg"}
                  className="card-img-top record-image"
                  alt={item.record_title}
                  style={{ objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-truncate">
                    {item.record_title}
                  </h5>
                  <div className="card-text small">
                    <p className="mb-1 text-truncate">
                      <strong className="description">Género:</strong>{" "}
                      {item.record_genre
                        ? item.record_genre.replace(/{|}/g, "")
                        : "Desconocido"}
                    </p>
                    <p className="mb-1">
                      <strong className="description">Año:</strong>{" "}
                      {item.record_year || "Desconocido"}
                    </p>
                  </div>
                  <div className="comments-section mt-auto">
                    <a href="#" onClick={() => handleShowCommentsModal(item)}>
                      Comentarios
                    </a>
                  </div>
                </div>
                <div className="card-footer bg-dark border-top-0">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleShowModal(item)}
                    >
                      Ver más
                    </button>
                    <div className="d-flex justify-content-center">
                      <button
                        onClick={() => handleAddToWishlist(item)}
                        className="fs-4 btn"
                        disabled={addLoading}
                      >
                        {item.isFavorite ? "❤️" : "💛"}
                      </button>
                    </div>
                    {store.user && item.owner_id !== store.user.id && (
                      <button
                        className="btn btn-success btn-sm mt-2 w-100"
                        onClick={() => handlePurchase(item.record_id)}
                      >
                        Comprar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-items">
            No hay ítems en venta que coincidan con tu búsqueda.
          </div>
        )}
      </div>

      <PaymentModal />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Intercambiar {selectedItem?.record_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem?.record_cover_image && (
            <img
              src={selectedItem.record_cover_image}
              alt={selectedItem.record_title}
              className="img-fluid mb-3"
            />
          )}
          <Form.Group>
            <Form.Label>Selecciona un disco de tu colección:</Form.Label>
            <Form.Control
              as="select"
              value={exchangeRecord}
              onChange={(e) => setExchangeRecord(e.target.value)}
            >
              <option value="">Selecciona un disco...</option>
              {userRecords.map((record) => (
                <option
                  key={record.id}
                  value={record.id}
                  disabled={record.id === selectedItem?.record_id}
                >
                  {record.title} - {record.year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleExchange}>
            Proponer Intercambio
          </Button>
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
          <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => navigate("/register")}>
            Registrarse
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCommentsModal} onHide={handleCloseCommentsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Comentarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div

            className="comments-list"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {Array.isArray(comments[selectedItem?.record_id])
              ? comments[selectedItem?.record_id].map((comment, index) => (
                <div key={index} className="comment-item mb-3">
                  <strong>{comment.user_name}:</strong> {comment.content}
                </div>
              ))
              : null}
          </div>
          <Form.Group className="mt-3">
            <Form.Control
              onKeyDown={handleKeyDown}
              as="textarea"
              rows={3}
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCommentsModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAddComment}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
