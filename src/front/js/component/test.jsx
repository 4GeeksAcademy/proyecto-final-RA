import React, { useContext, useState } from 'react';
import { Context } from '../store/appContext';

const RecordsList = () => {
    const { store, actions } = useContext(Context);
    const [query, setQuery] = useState('');

    // Función para manejar la búsqueda
    const handleSearch = () => {
        if (query.trim()) {
            actions.fetchDiscogsRecords(query);
        }
    };

    return (
        <div>
            <h1>Buscar Discos</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Introduce el nombre del disco"
            />
            <button onClick={handleSearch} disabled={store.loading}>
                {store.loading ? 'Cargando...' : 'Buscar'}
            </button>

            {store.error && <p style={{ color: 'red' }}>{store.error}</p>}

            <div>
                {store.records.map((record) => (
                    <div key={record.id}>
                        <h2>{record.title}</h2>
                        <p>{record.artist}</p>
                        {record.thumb && <img src={record.thumb} alt={record.title} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecordsList;
