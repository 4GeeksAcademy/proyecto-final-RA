import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"; // Usamos el contexto de 'appContext'
import "../../styles/worldwide.css"

export const SearchMusic = () => {
    const { store, actions } = useContext(Context); // Usamos 'store' y 'actions' del contexto
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('artist');
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

    const addToCollection = async (musicItem) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert('Por favor, inicie sesión para agregar música a su colección.');
            return;
        }

        try {
            const response = await fetch('https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/collections/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ musicItem })
            });

            const data = await response.json();

            if (data.success) {
                alert('Música agregada a tu colección');
            } else {
                alert('Hubo un error al agregar la música.');
            }
        } catch (error) {
            console.error('Error al agregar música:', error);
            alert('Hubo un error al agregar la música.');
        }
    };

    return (
        <div className="search-music">
            <h2>Buscar Música</h2>
            <div>
                <label>
                    Tipo de Búsqueda:
                    <select value={searchType} onChange={handleSearchTypeChange}>
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
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Buscar..."
                />
                <button onClick={handleSearch}>Buscar</button>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                {records.length > 0 && (
                    <ul>
                        {records.map((item, index) => (
                            <li key={index} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                                <div>
                                    {/* Mostramos la imagen del álbum */}
                                    {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
                                </div>
                                <div>
                                    <p><strong>Título:</strong> {item.title}</p>
                                    <p><strong>Artista:</strong> {item.artist}</p>
                                    {/* Mostramos el precio si está disponible */}
                                    {item.price && <p><strong>Precio:</strong> {item.price}</p>}
                                    {/* Botón para agregar la música a la colección */}
                                    <button onClick={() => addToCollection(item)}>Agregar a mi colección</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
