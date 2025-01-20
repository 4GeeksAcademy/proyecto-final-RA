import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"; // Usamos el contexto de 'appContext'
import "../../styles/worldwide.css";
import { Carousel } from "react-bootstrap";

export const SearchMusic = () => {
    const { store, actions } = useContext(Context); // Usamos 'store' y 'actions' del contexto
    const [query, setQuery] = useState('');  // Estado de la consulta de búsqueda (por artista)
    const { loading, error, records } = store; // Accedemos al estado 'store'

    const handleInputChange = (e) => {
        setQuery(e.target.value);  // Actualiza el valor de la consulta (artista)
    };

    const handleSearch = (e) => {
        e.preventDefault();  // Prevenir el comportamiento predeterminado del formulario
        actions.fetchRecords(query);  // Llamamos a la acción con la query (la consulta de búsqueda)
    };

    return (
        <div className="app">
            <div className="search-music">
                <h2>Buscar Música</h2>
                <form onSubmit={handleSearch}>
                    <div>
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Buscar por Artista..."
                        />
                    </div>
                    <div>
                        <button type="submit">Buscar</button>  {/* El botón de búsqueda ahora es un 'submit' */}
                    </div>
                </form>

                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div>
                    {records.length > 0 && (
                        <Carousel>
                            {records.map((record, index) => (
                                <Carousel.Item key={index}>
                                    <div className="d-flex justify-content-center text-dark">
                                        <div
                                            className="card"
                                            style={{ width: "18rem", textAlign: "center" }}
                                        >
                                            <img
                                                src={record.cover_image} // Usamos 'cover_image' para la imagen
                                                className="card-img-top"
                                                alt={record.title || "Sin título"}
                                                style={{ borderRadius: "8px" }}
                                            />
                                            <div className="card-body text-dark mb-3">
                                                <h5 className="card-title text-dark">{record.title || "Título desconocido"}</h5>
                                                <p className="card-text text-dark">Artista: {record.artist || "Artista desconocido"}</p>
                                                <p className="card-text text-dark">Precio: {record.price || "No disponible"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchMusic;
