import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Carousel, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Search = () => {
  const { store, actions } = useContext(Context);
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("artist");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true); // Cambia el estado de carga a verdadero
    actions.searchDiscogs(query, searchBy);
  };

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const [isAdding, setIsAdding] = useState(false);

  const handleAddRecord = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/add_record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: selectedRecord.title,
          year: selectedRecord.year,
          genre: selectedRecord.genre,
          label: selectedRecord.label,
          style: selectedRecord.style,
          cover_image: selectedRecord.cover_image,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Disco agregado:", result);
        actions.addRecordToDatabase(selectedRecord);
        handleCloseModal();
      } else {
        const errorResult = await response.json();
        console.error("Error al agregar disco:", errorResult.error);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [store.searchResults]); // Reacciona cuando store.searchResults cambie

  // Dividir resultados en bloques de 5
  const chunkedResults = [];
  for (let i = 0; i < store.searchResults.length; i += 5) {
    chunkedResults.push(store.searchResults.slice(i, i + 5));
  }

  return (
    <div className="container d-flex flex-column align-items-center my-4">
      <h1 className="text-center mb-4">Buscar en Discogs</h1>
      <div className="w-50 d-flex flex-column align-items-center">
        <div className="w-100 d-flex justify-content-between mb-3">
          <select
            className="form-control"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="artist">Artista</option>
            <option value="label">Sello</option>
            <option value="genre">Género</option>
          </select>
        </div>
        <input
          type="text"
          className="form-control mb-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ingresa un término de búsqueda"
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}

      {chunkedResults.length > 0 ? (
        <div className="container my-4">
          <h2 className="text-center mb-4">Resultados</h2>
          <Carousel>
            {chunkedResults.map((chunk, index) => (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-center">
                  {chunk.map((record) => (
                    <div
                      key={record.id}
                      className="card text-white bg-dark mx-2"
                      style={{ width: "18rem", textAlign: "center", cursor: "pointer" }}
                      onClick={() => handleShowModal(record)}
                    >
                      <img
                        src={record.cover_image || "placeholder.jpg"}
                        className="card-img-top"
                        alt={record.title}
                        style={{ borderRadius: "8px" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{record.title}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      ) : (
        <p>No se encontraron resultados</p>
      )}

      {/* Modal para mostrar detalles del registro */}
      {selectedRecord && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="custom-modal"
        >
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title id="contained-modal-title-vcenter">{selectedRecord.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <div className="d-flex justify-content-center">
              <div
                className="card text-white bg-dark mb-5"
                style={{ width: "18rem", textAlign: "center" }}
              >
                <img
                  src={selectedRecord.cover_image || "placeholder.jpg"}
                  className="card-img-top"
                  alt={selectedRecord.title}
                  style={{ borderRadius: "8px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{selectedRecord.title}</h5>
                  <p className="card-text">Artista: {selectedRecord.artist || "Desconocido"}</p>
                  <p className="card-text">
                    Género: {selectedRecord.genre ? selectedRecord.genre.join(", ") : "N/A"}
                  </p>
                  <p className="card-text">Año: {selectedRecord.year || "Desconocido"}</p>
                  <p className="card-text">Sello: {selectedRecord.label || "Desconocido"}</p>
                  <p className="card-text">Estilo: {selectedRecord.style || "N/A"}</p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleAddRecord}>
              Agregar Disco
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Search;


