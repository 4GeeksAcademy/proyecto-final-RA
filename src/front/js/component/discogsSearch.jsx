import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../store/appContext";

const DiscogsSearch = () => {
  const { store, actions } = useContext(Context);
  const [query, setQuery] = useState(''); 

  const handleSearch = (e) => {
    e.preventDefault(); 
    actions.searchDiscogs(query);  
  };

  useEffect(() => {
  }, [store.results, store.loading, store.error]);

  return (
    <div>
      <h1>Buscar en Discogs</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ingresa un término de búsqueda"
      />
      <button onClick={handleSearch} disabled={store.loading}>
        {store.loading ? 'Buscando...' : 'Buscar'}
      </button>

      {store.error && <p style={{ color: 'red' }}>{store.error}</p>}

      <div>
        {store.results.length > 0 && (
          <ul>
            {store.results.map((result, index) => (
              <li key={index}>
                <img src={result.cover_image} alt={result.title} width="100" />
                <br />
                <strong>{result.title}</strong> 
                <br />
                <strong>{result.label}</strong>
                <br />
                <strong>{result.year}</strong>
                <br />
                <strong>{result.genre}</strong>
                <br />
                <strong>{result.style}</strong>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DiscogsSearch;
