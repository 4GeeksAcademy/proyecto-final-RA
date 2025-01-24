import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/searchMusic.css";

export const SearchMusic = () => {
    const { store, actions } = useContext(Context);
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('artist');
    const { loading, error, records } = store;

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

    const handleSearch = () => {
        actions.fetchDiscogsRecords(searchType, query);
    };

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

                <div>
                    {records.length > 0 && (
                        <ul>
                            {records.map((item, index) => (
                                <li key={index} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                                    <div>
                                        {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
                                    </div>
                                    <div>
                                        <p><strong>Título:</strong> {item.title}</p>
                                        <p><strong>Artista:</strong> {item.artist}</p>
                                        {item.price && <p><strong>Precio:</strong> {item.price}</p>}
                                        <button onClick={() => (item)}>Agregar a mi colección</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchMusic;