import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/recordCarousel.css";


const Search = () => {
  const { store, actions } = useContext(Context);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual

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

  const handleAddRecord = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No se encontró el token. Asegúrate de haber iniciado sesión.");
      return;
    }

    setAddLoading(true);

    try {
      const response = await fetch(process.env.BACKEND_URL + '/api/add_record', {
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

  // Cambié el código del carrusel para que coincida con el de SearchInvitados
  const handlePageChange = (direction) => {
    if (direction === "next") {
      setCurrentPage((prevPage) => (prevPage + 1) % slides.length); // Circular hacia adelante
    } else if (direction === "prev") {
      setCurrentPage((prevPage) =>
        prevPage === 0 ? slides.length - 1 : prevPage - 1
      ); // Circular hacia atrás
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

      {store.error && (
        <div className="search-error alert alert-danger mt-3">{store.error}</div>
      )}

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
                    onClick={() => setSelectedRecord(record)}
                  >
                    <img
                      src={record.cover_image}
                      className="card-img-top"
                      alt={record.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{record.title}</h5>
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

      {/* Modal para el detalle de disco */}
      {selectedRecord && (
        <div
          className="search-modal modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="search-modal-dialog modal-dialog-centered modal-sm"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-modal-content modal-content text-dark">
              <div className="search-modal-header modal-header">
                <h5 className="search-modal-title modal-title text-dark">{selectedRecord.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRecord(null)}
                ></button>
              </div>
              <div className="search-modal-body modal-body text-dark">
                <img
                  src={selectedRecord.cover_image}
                  alt={selectedRecord.title}
                  className="search-modal-img img-fluid mb-3"
                />
                <p className="text-dark">
                  <strong>Artista:</strong> {selectedRecord.title || "Desconocido"}
                </p>
                <p className="text-dark">
                  <strong>Género:</strong>
                  {Array.isArray(selectedRecord.genre)
                    ? selectedRecord.genre.join(", ")
                    : selectedRecord.genre || "Sin género"}
                </p>
                <p className="text-dark">
                  <strong>Sello:</strong>
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
              <div className="search-modal-footer modal-footer">
                <button
                  type="button"
                  className="search-modal-btn-close btn btn-secondary"
                  onClick={() => setSelectedRecord(null)}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="search-modal-btn-add btn btn-primary"
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
        <div className="search-message alert alert-info mt-3">
          {message}
        </div>
      )}
    </div>


  );
};

export default Search;
