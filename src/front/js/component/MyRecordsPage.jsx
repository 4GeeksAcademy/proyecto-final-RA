// src/js/pages/MyRecordsPage.jsx
import React, { useState, useEffect } from 'react';
import AddRecordModal from '../component/AddRecordModal'; // Importa el modal

const MyRecordsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState([]); // Lista de discos en tu base de datos
  const [apiData, setApiData] = useState([]); // Discos obtenidos de la API

  useEffect(() => {
    // Obtener discos de la API externa (por ejemplo, Discogs)
    const fetchApiData = async () => {
      try {
        const response = await fetch('https://api.discogs.com/some-endpoint'); // Cambia esta URL por la que estés usando
        const data = await response.json();
        setApiData(data.records); // Ajusta esto según la respuesta real de la API
      } catch (error) {
        console.error('Error al obtener discos de la API:', error);
      }
    };

    fetchApiData();
  }, []); // Solo se ejecuta una vez cuando se monta el componente

  const handleAddRecord = (newRecord) => {
    setRecords([...records, newRecord]);
  };

  return (
    <div>
      <h1>Mis Discos</h1>
      <button onClick={() => setShowModal(true)}>Agregar Disco desde API</button>

      {/* Mostrar la lista de discos en la base de datos */}
      <ul>
        {records.map((record) => (
          <li key={record.id}>{record.title}</li>
        ))}
      </ul>

      {/* Mostrar el modal */}
      <AddRecordModal
        show={showModal}
        onHide={() => setShowModal(false)} // Cerrar el modal
        onAddRecord={handleAddRecord} // Actualizar la lista de discos
        apiData={apiData} // Pasar los discos de la API al modal
      />
    </div>
  );
};

export default MyRecordsPage;
