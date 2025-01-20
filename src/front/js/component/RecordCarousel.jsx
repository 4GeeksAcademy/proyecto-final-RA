import React from "react";
import { Carousel } from "react-bootstrap";

// Lista de datos
const records = [
  {
    id: 1,
    name: "Abbey Road",
    artist: "The Beatles",
    price: "$19.99",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Thriller",
    artist: "Michael Jackson",
    price: "$24.99",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Dark Side of the Moon",
    artist: "Pink Floyd",
    price: "$22.99",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Back in Black",
    artist: "AC/DC",
    price: "$21.99",
    image: "https://via.placeholder.com/150",
  },
];

export const RecordCarousel = () => {
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

  <div className="container my-4">
    <h2 className="text-center mb-4">Resultados de la búsqueda</h2>
    <Carousel>
      {store.results.length > 0 &&
        store.results.map((result, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center">
              <div className="card" style={{ width: "18rem", textAlign: "center" }}>
                <img
                  src={result.cover_image}
                  className="card-img-top"
                  alt={result.title}
                  style={{ borderRadius: "8px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{result.title}</h5>
                  <p className="card-text">Etiqueta: {result.label}</p>
                  <p className="card-text">Año: {result.year}</p>
                  <p className="card-text">Género: {result.genre}</p>
                  <p className="card-text">Estilo: {result.style}</p>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
    </Carousel>
  </div>
</div>

  );
};



