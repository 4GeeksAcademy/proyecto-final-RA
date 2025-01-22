import React from "react";
import { Carousel } from "react-bootstrap";
import "../../styles/carousel.css"

export const RecordCarousel = () => {
  // Dividir los elementos en bloques de 5
  const chunkedRecords = [];
  for (let i = 0; i < records.length; i += 5) {
    chunkedRecords.push(records.slice(i, i + 5));
  }

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Lista de Discos</h2>
      <Carousel>
        {chunkedRecords.map((chunk, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center">
              {chunk.map((record) => (
                <div key={record.id} className="card mx-2" style={{ width: "18rem", textAlign: "center" }}>
                  <img
                    src={record.image}
                    className="card-img-top"
                    alt={record.name}
                    style={{ borderRadius: "8px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{record.name}</h5>
                    <p className="card-text">Artista: {record.artist}</p>
                    <p className="card-text">Precio: {record.price}</p>
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