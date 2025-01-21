import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Carousel, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SearchInvitados = () => {
  const { store, actions } = useContext(Context);
  const [query, setQuery] = useState(""); // Término de búsqueda
  const [searchBy, setSearchBy] = useState("artist"); // Tipo de búsqueda
  const [showModal, setShowModal] = useState(false); // Estado del modal
  const [selectedRecord, setSelectedRecord] = useState(null); // Disco seleccionado

  useEffect(() => {
    // Realizar búsqueda aleatoria solo si no se han obtenido resultados aleatorios antes
    if (!store.randomFetched) {
      actions.FetchRandomRecords();  // Llamar FetchRandomRecords una sola vez
    }
  }, [store.randomFetched, actions]);  // Ejecutar solo si no se han obtenido resultados aleatorios

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return; // No realizar búsqueda si el query está vacío

    actions.searchDiscogs(query, searchBy); // Llamar a la acción de búsqueda
  };

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true); // Muestra el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
    setSelectedRecord(null); // Limpia el disco seleccionado
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Buscar en Discogs</h1>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="d-flex justify-content-center align-items-center">
          <select
            className="form-control w-auto me-3"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="artist">Artista</option>
            <option value="label">Sello</option>
            <option value="genre">Género</option>
          </select>
          <input
            type="text"
            className="form-control w-auto me-3"
            placeholder="Ingresa un término"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={store.loading || store.isSearching}>
            {store.loading || store.isSearching ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {store.error && <p className="text-danger text-center">{store.error}</p>}

      {store.searchResults.length > 0 && (
        <div className="mt-4">
          <h2 className="text-center mb-4">Resultados</h2>
          <Carousel>
            {store.searchResults.map((record, index) => (
              <Carousel.Item key={index} onClick={() => handleShowModal(record)}>
                <div className="d-flex justify-content-center">
                  <div
                    className="card bg-dark text-white"
                    style={{ width: "18rem", cursor: "pointer" }}
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
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
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
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SearchInvitados;








