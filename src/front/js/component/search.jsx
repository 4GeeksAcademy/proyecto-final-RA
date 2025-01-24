import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/carousel.css";

const Search = () => {
  const { store, actions } = useContext(Context);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    actions.searchDiscogs(query);
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

  const slides = chunkArray(store.searchResults, 5);

  // Función para agregar el disco
  const handleAddRecord = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No se encontró el token. Asegúrate de haber iniciado sesión.");
      return;
    }

    setAddLoading(true);

    try {
      const response = await fetch(process.env.BACKEND_URL + 'api/add_record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: selectedRecord.title,
          label: selectedRecord.label,
          year: selectedRecord.year,
          genre: selectedRecord.genre,
          style: selectedRecord.style,
          cover_image: selectedRecord.cover_image,
          owner_id: store.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al agregar el disco");
      }

      const data = await response.json();
      console.log("Disco agregado:", data);

      setMessage("Disco agregado exitosamente!");
      setAddLoading(false);
      setSelectedRecord(null);

    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al agregar el disco: " + error.message);
      setAddLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center my-4">
      <h1 className="text-center mb-4">Buscar en la Plataforma</h1>
      <div className="w-50 d-flex flex-column align-items-center">
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

      {store.error && (
        <div className="alert alert-danger mt-3">{store.error}</div>
      )}

      <div id="carouselExample" className="carousel slide mt-4" data-bs-ride="carousel">
        <div className="carousel-inner">
          {slides.map((group, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <div className="row justify-content-center">
                {group.map((record, idx) => (
                  <div key={idx} className="col-md-2">
                    <div
                      className="card"
                      onClick={() => setSelectedRecord(record)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={record.cover_image}
                        className="card-img-top"
                        alt={record.title}
                      />
                      <div className="card-body">
                        <p className="card-title text-dark">{record.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {selectedRecord && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content text-dark">
              <div className="modal-header">
                <h5 className="modal-title text-dark">{selectedRecord.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRecord(null)}
                ></button>
              </div>
              <div className="modal-body text-dark">
                <img
                  src={selectedRecord.cover_image}
                  alt={selectedRecord.title}
                  className="img-fluid mb-3"
                />
                <p className="text-dark">
                  <strong>Artista:</strong> {selectedRecord.title || "Desconocido"}
                </p>
                <p className="text-dark">
                  <strong>Género:</strong>
                  {/* Verificamos si 'genre' es un array y lo unimos con coma */}
                  {Array.isArray(selectedRecord.genre)
                    ? selectedRecord.genre.join(", ")
                    : selectedRecord.genre || "Sin género"}
                </p>
                <p className="text-dark">
                  <strong>Sello:</strong>
                  {/* Verificamos si 'label' es un array y lo unimos con coma */}
                  {Array.isArray(selectedRecord.label)
                    ? selectedRecord.label.join(", ")
                    : selectedRecord.label || "Desconocido"}
                </p>
                <p className="text-dark">
                  <strong>Año:</strong> {selectedRecord.year || "Desconocido"}
                </p>
                <p className="text-dark">
                  <strong>País:</strong> {selectedRecord.country || "Desconocido"}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedRecord(null)}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddRecord}
                  disabled={addLoading}
                >
                  {addLoading ? "Agregando..." : "Agregar Disco"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="alert alert-info mt-3">
          {message}
        </div>
      )}
    </div>
  );
};

export default Search;
