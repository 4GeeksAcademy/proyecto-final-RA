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
    <div className="container my-4">
      <h2 className="text-center mb-4">Lista de Discos</h2>
      <Carousel>
        {records.map((record) => (
          <Carousel.Item key={record.id}>
            <div className="d-flex justify-content-center">
              <div
                className="card"
                style={{ width: "18rem", textAlign: "center" }}
              >
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
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};


