// src/js/component/AddRecordModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const AddRecordModal = ({ show, onHide, onAddRecord, apiData }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleAddRecord = async () => {
    if (!selectedRecord) return;

    const recordToAdd = {
      title: selectedRecord.title,
      label: selectedRecord.label,
      year: selectedRecord.year,
      genre: selectedRecord.genre,
      style: selectedRecord.style,
      cover_image: selectedRecord.cover_image,
    };

    try {
      const response = await fetch('/api/add_record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // O token que uses
        },
        body: JSON.stringify(recordToAdd),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Disco agregado exitosamente!');
        onAddRecord(data.record); // Callback para actualizar la lista de discos
        onHide(); // Cerrar el modal
      } else {
        const errorData = await response.json();
        alert('Error al agregar el disco: ' + errorData.error);
      }
    } catch (error) {
      alert('Hubo un error al agregar el disco.');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Selecciona un Disco para Agregar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Mostrar los discos obtenidos de la API */}
        <ListGroup>
          {apiData && apiData.map((record) => (
            <ListGroup.Item
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              style={{ cursor: 'pointer', backgroundColor: selectedRecord?.id === record.id ? '#f0f0f0' : '' }}
            >
              <img src={record.cover_image} alt={record.title} style={{ width: '50px', marginRight: '10px' }} />
              {record.title} - {record.year}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleAddRecord} disabled={!selectedRecord}>
          Agregar Disco
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRecordModal;
