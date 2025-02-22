import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Modal, Button } from "react-bootstrap";
// import "../../styles/searchInvitados.css";
import "../../styles/components/_search.css"

const SearchInvitados = () => {
  const { store, actions } = useContext(Context);
  const [query, setQuery] = useState(""); 
  const [searchBy, setSearchBy] = useState("artist"); 
  const [showModal, setShowModal] = useState(false); 
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addLoading, setAddLoading] = useState(false); 
  const [currentPage, setCurrentPage] = useState(0); 

  useEffect(() => {
    if (!store.randomFetched) {
      actions.FetchRandomRecords();
    }
  }, [store.randomFetched, actions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
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

  const handleAddRecord = () => {
    setAddLoading(true);
    setTimeout(() => {
      setAddLoading(false);
      alert("¡Regístrate o inicia sesión!");
      setSelectedRecord(null);
    }, 1000);
  };

  const chunkedResults = [];
  const limitedResults = store.searchResults.slice(0, 50); 
  for (let i = 0; i < limitedResults.length; i += 5) {
    chunkedResults.push(limitedResults.slice(i, i + 5));
  }

  const handlePageChange = (direction) => {
    if (direction === "next") {
      setCurrentPage((prevPage) => (prevPage + 1) % chunkedResults.length); 
    } else if (direction === "prev") {
      setCurrentPage((prevPage) =>
        prevPage === 0 ? chunkedResults.length - 1 : prevPage - 1
      ); 
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">¡Encuentra Tus Favoritos!</h1>

      <form onSubmit={handleSearch} className="">
        <div className="d-flex justify-content-center align-items-center">

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

      {chunkedResults.length > 0 && (
        <div className="mt-4">
          <div className="decorative-bar top-bar"></div>
          <h2 className="text-center mb-1">Resultados</h2>

          <div className="carousel-wrapper">
            <button
              className="carousel-control prev"
              onClick={() => handlePageChange("prev")}
            >
              &#8249;
            </button>

            <div className="carousel-inner">
              <div className="d-flex justify-content-center">
                {chunkedResults[currentPage].map((record, idx) => (
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

export default SearchInvitados;





