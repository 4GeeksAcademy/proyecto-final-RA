import React, { useContext, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { Context } from "../store/appContext";
import "../../styles/randomRecordsCarousel.css";

const RandomRecordsCarousel = () => {
  const { store, actions } = useContext(Context);
  const [selectedRecord, setSelectedRecord] = useState(null); // Estado para el modal
  const [addLoading, setAddLoading] = useState(false); // Estado para botón de "Agregar Disco"
  const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual del carrusel

  // Llamada automática a FetchRandomRecords al montar el componente
  useEffect(() => {
    if (!store.loading && !store.isSearching && store.randomResults.length === 0) {
      actions.FetchRandomRecords("Drum & Bass");
    }
  }, [store.loading, store.isSearching, store.randomResults.length, actions]);

  // Muestra un mensaje mientras se cargan los datos
  if (store.loading) {
    return <p>Cargando discos...</p>;
  }

  // Muestra un mensaje de error si algo falla
  if (store.error) {
    return <p style={{ color: "red" }}>Error: {store.error}</p>;
  }

  // Obtiene los primeros 50 resultados
  const results = store.randomResults.slice(0, 50);

  // Divide los resultados en páginas de 5 elementos cada una
  const chunkedResults = [];
  for (let i = 0; i < results.length; i += 5) {
    chunkedResults.push(results.slice(i, i + 5));
  }

  // Maneja la acción de agregar un disco
  const handleAddRecord = () => {
    setAddLoading(true);
    // Simulación de la lógica de agregar un disco
    setTimeout(() => {
      setAddLoading(false);
      alert("¡Regístrate o inicia sesión!");
      setSelectedRecord(null); // Cierra el modal
    }, 1000); // Simula un retraso
  };

  // Muestra un mensaje si no hay resultados
  if (!chunkedResults.length) {
    return <p>No se encontraron discos para mostrar.</p>;
  }

  // Función para cambiar la página (con comportamiento circular)
  const handlePageChange = (direction) => {
    if (direction === "next") {
      setCurrentPage((prevPage) => (prevPage + 1) % chunkedResults.length); // Circular hacia adelante
    } else if (direction === "prev") {
      setCurrentPage((prevPage) =>
        prevPage === 0 ? chunkedResults.length - 1 : prevPage - 1
      ); // Circular hacia atrás
    }
  };

  return (
    <div className="random-records-carousel">
      {/* Barra superior decorativa */}
      <div className="decorative-bar top-bar"></div>
      <h2 className="text-center mb-4">Popular Entre Otros Usuarios</h2>
      <div className="carousel-wrapper">
        {/* Botón para desplazarse hacia atrás */}
        <button
          className="carousel-control prev"
          onClick={() => handlePageChange("prev")}
        >
          &#8249;
        </button>

        {/* Contenido del carrusel */}
        <div className="carousel-inner">
          <div className="d-flex justify-content-center">
            {chunkedResults[currentPage].map((result) => (
              <div
                key={result.id}
                className="card mx-2"
                style={{ width: "18rem", textAlign: "center" }}
                onClick={() => setSelectedRecord(result)} // Al hacer clic, abre el modal con el disco seleccionado
              >
                <img
                  src={result.cover_image || "placeholder.jpg"}
                  className="card-img-top"
                  alt={result.title || "Imagen no disponible"}
                  style={{ borderRadius: "8px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {result.title || "Título no disponible"}
                  </h5>
                  <p className="card-text">Etiqueta: {result.label?.[0] || "N/A"}</p>
                  <p className="card-text">Año: {result.year || "N/A"}</p>
                  <p className="card-text">Género: {result.genre?.[0] || "N/A"}</p>
                  <p className="card-text">Estilo: {result.style?.[0] || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón para desplazarse hacia adelante */}
        <button
          className="carousel-control next"
          onClick={() => handlePageChange("next")}
        >
          &#8250;
        </button>
      </div>
      {/* Barra inferior decorativa */}
      <div className="decorative-bar bottom-bar"></div>

      {/* Modal para mostrar detalles del disco seleccionado */}
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
    </div>
  );
};

export default RandomRecordsCarousel;











