import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"; // Usamos el contexto de 'appContext'
import "../../styles/searchMusic.css";

const SearchMusic = () => {
  const { store, actions } = useContext(Context); // Usamos 'store' y 'actions' del contexto
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("artist");
  const { loading, error, records } = store; // Accedemos al estado 'store'

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = () => {
    actions.fetchDiscogsRecords(searchType, query); // Llamada a la acción directamente
  };

  console.log("====>", store);

  return (
    <div className="app">
      <div className="search-music">
        <h2>Buscar Música</h2>
        <div>
          <label>
            Tipo de Búsqueda:
            <select value={searchType} onChange={handleSearchTypeChange} className="custom-select">  {/* Use custom-select instead of form-control */}
              <option value="artist">Artista</option>
              <option value="genre">Género</option>
              <option value="song">Canción</option>
              <option value="label">Sello</option>
            </select>
          </label>
        </div>

        <div>
          <input
            type="text"
            className="custom-input" // Use custom-input instead of form-control
            value={query}
            onChange={handleInputChange}
            placeholder="Buscar..."
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Buscar
          </button>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {records.length > 0 && (
          <ul>
            {records.map((item, index) => (
              <li key={index} className="record-item"> {/* Use record-item class */}
                <div>
                  {/* Mostramos la imagen del álbum */}
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div>
                  <p className="record-title"><strong>Título:</strong> {item.title}</p>
                  <p className="record-artist"><strong>Artista:</strong> {item.artist}</p>
                  {/* Mostramos el precio si está disponible */}
                  {item.price && <p className="record-price"><strong>Precio:</strong> {item.price}</p>}
                  {/* Botón para agregar la música a la colección */}
                  <button onClick={() => (item)} className="btn btn-secondary">
                    Agregar a mi colección
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchMusic;