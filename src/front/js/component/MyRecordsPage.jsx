// src/js/pages/MyRecordsPage.jsx
import React, { useState, useEffect } from 'react';
import AddRecordModal from '../component/AddRecordModal'; // Importación con nombre
// import "../../styles/myRecordsPage.css";

const MyRecordsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await fetch('https://api.discogs.com/some-endpoint'); 
        const data = await response.json();
        setApiData(data.records); 
      } catch (error) {
        console.error('Error al obtener discos de la API:', error);
      }
    };

    fetchApiData();
  }, []); 

  const handleAddRecord = (newRecord) => {
    setRecords([...records, newRecord]);
  };

  return (
    <div className="my-records-container">
      <h1>Mis Discos</h1>
      <button onClick={() => setShowModal(true)}>Agregar Disco desde API</button>

      <ul className="record-list">
        {records.map((record) => (
          <li key={record.id}>{record.title}</li>
        ))}
      </ul>

      <AddRecordModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onAddRecord={handleAddRecord}
        apiData={apiData}
      />
    </div>
  );
};


export default MyRecordsPage;
