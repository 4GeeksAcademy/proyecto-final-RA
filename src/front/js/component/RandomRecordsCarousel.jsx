import React, { useContext, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { Context } from "../store/appContext";
import "../../styles/carousel.css"

const RandomRecordsCarousel = () => {
  const { store, actions } = useContext(Context);

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

  // Obtiene los resultados de randomResults, los baraja y limita a 10
  const shuffledResults = [...store.randomResults]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  // Divide los resultados en bloques de 5
  const chunkedResults = [];
  for (let i = 0; i < shuffledResults.length; i += 5) {
    chunkedResults.push(shuffledResults.slice(i, i + 5));
  }

  // Muestra un mensaje si no hay resultados
  if (!chunkedResults.length) {
    return <p>No se encontraron discos para mostrar.</p>;
  }

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Populares Entre Los Usuarios</h2>
      <Carousel>
        {chunkedResults.map((chunk, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center">
              {chunk.map((result) => (
                <div
                  key={result.id}
                  className="card mx-2"
                  style={{ width: "18rem", textAlign: "center" }}
                >
                  <img
                    src={result.cover_image || "placeholder.jpg"}
                    className="card-img-top"
                    alt={result.title || "Imagen no disponible"}
                    style={{ borderRadius: "8px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{result.title || "Título no disponible"}</h5>
                    <p className="card-text">Etiqueta: {result.label?.[0] || "N/A"}</p>
                    <p className="card-text">Año: {result.year || "N/A"}</p>
                    <p className="card-text">Género: {result.genre?.[0] || "N/A"}</p>
                    <p className="card-text">Estilo: {result.style?.[0] || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default RandomRecordsCarousel;





