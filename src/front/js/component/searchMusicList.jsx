import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"; // Usamos el contexto de 'appContext'
// import "../../styles/searchMusicList.css";
import { Carousel } from "react-bootstrap"; // Asegúrate de importar Carousel

const SearchMusic = () => {
  const { store, actions } = useContext(Context); // Usamos 'store' y 'actions' del contexto
  const [query, setQuery] = useState(""); // Estado de la consulta de búsqueda (por artista)
  const { loading, error, records } = store; // Accedemos al estado 'store'

  const handleInputChange = (e) => {
    setQuery(e.target.value); // Actualiza el valor de la consulta (artista)
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    actions.fetchRecords(query); // Llamamos a la acción con la query (la consulta de búsqueda)
  };

  return (
    <div className="app">
      <div className="search-music">
        <h2>Buscar Música</h2>
        <form onSubmit={handleSearch}>
          <div>
            <input
              type="text"
              className="search-input" 
              value={query}
              onChange={handleInputChange}
              placeholder="Buscar por Artista..."
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </div>
        </form>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {records.length > 0 && (
          <Carousel>
            {records.map((record, index) => (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-center text-dark">
                  <div
                    className="record-item" 
                    style={{ width: "18rem", textAlign: "center" }}
                  >
                    <img
                      src={record.cover_image} 
                      className="record-image" 
                      alt={record.title || "Sin título"}
                      style={{ borderRadius: "8px" }}
                    />
                    <div className="record-details text-dark mb-3">
                      <h5 className="record-title text-dark">
                        {record.title || "Título desconocido"}
                      </h5>
                      <p className="record-artist text-dark">
                        Artista: {record.artist || "Artista desconocido"}
                      </p>
                      <p className="record-price text-dark">
                        Precio: {record.price || "No disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default SearchMusic;