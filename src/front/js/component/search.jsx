import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const Search = () => {
  const { store, actions } = useContext(Context);
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("artist"); 
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [addLoading, setAddLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    actions.searchDiscogs(query, searchBy);
  };

  useEffect(() => {
    setLoading(false);
  }, [store.searchResults]);

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const chunkedResults = chunkArray(store.searchResults || [], 5);
  const slides = chunkedResults;

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const handlePageChange = (direction) => {
    if (direction === "next") {
      setCurrentPage((prevPage) => (prevPage + 1) % slides.length);
    } else if (direction === "prev") {
      setCurrentPage((prevPage) =>
        prevPage === 0 ? slides.length - 1 : prevPage - 1
      ); // Circular hacia atrás
    }
  };

  const handleAddRecord = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No se encontró el token. Asegúrate de haber iniciado sesión.");
      return;
    }

    setAddLoading(true);

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/add_record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: selectedRecord?.title || "Sin título",
          label: selectedRecord?.label || [],
          year: selectedRecord?.year || "Desconocido",
          genre: selectedRecord?.genre || [],
          style: selectedRecord?.style || [],
          cover_image: selectedRecord?.cover_image || "",
          owner_id: store.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al agregar el disco");
      }

      const data = await response.json();
      setMessage("¡Disco agregado exitosamente!");
      setAddLoading(false);
      setSelectedRecord(null);

      actions.getRecords()
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al agregar el disco: " + error.message);
      setAddLoading(false);
    }
  };

  return (
    <div className="search-container container d-flex flex-column align-items-center my-4">
      <h1 className="search-title text-center mb-4">¡Encuentra Tus Favoritos!</h1>
      <div className="search-form w-50 d-flex flex-column align-items-center">
        <input
          type="text"
          className="search-input form-control mb-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ingresa un término de búsqueda"
        />
        <button
          className="search-btn btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {store.error && <p className="text-danger text-center">{store.error}</p>}

      {slides.length > 0 && (
        <div className="mt-4">
          <div className="decorative-bar top-bar"></div>
          <h2 className="text-center mb-4">Resultados</h2>

          <div className="carousel-wrapper">
            <button
              className="carousel-control prev"
              onClick={() => handlePageChange("prev")}
            >
              &#8249;
            </button>

            <div className="carousel-inner">
              <div className="d-flex justify-content-center">
                {slides[currentPage].map((record, idx) => (
                  <div
                    key={idx}
                    className="card bg-dark text-white mx-2"
                    style={{ width: "18rem", cursor: "pointer" }}
                    onClick={() => handleShowModal(record)}
                  >
                    <img
                      src={record.cover_image || "placeholder.jpg"}
                      className="card-img-top"
                      alt={record.title || "Sin título"}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{record.title || "Sin título"}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="carousel-control next"
              onClick={() => handlePageChange("next")}
            >
              &#8250;
            </button>
          </div>

          <div className="decorative-bar bottom-bar"></div>
        </div>
      )}

      {selectedRecord && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRecord.title || "Sin título"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedRecord.cover_image || "placeholder.jpg"}
              className="img-fluid rounded mb-3"
              alt={selectedRecord.title || "Sin título"}
            />
            <p>
              <strong>Artista:</strong> {selectedRecord.artist || "Desconocido"}
            </p>
            <p>
              <strong>Género:</strong>{" "}
              {selectedRecord.genre ? selectedRecord.genre.join(", ") : "N/A"}
            </p>
            <p>
              <strong>Año:</strong> {selectedRecord.year || "Desconocido"}
            </p>
            <p>
              <strong>Sello:</strong>{" "}
              {selectedRecord.label ? selectedRecord.label.join(", ") : "N/A"}
            </p>
            <p>
              <strong>Estilo:</strong>{" "}
              {selectedRecord.style ? selectedRecord.style.join(", ") : "N/A"}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddRecord}
              disabled={addLoading}
            >
              {addLoading ? "Agregando..." : "Agregar Disco"}
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Search;
