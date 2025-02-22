import React, { useState } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
// import "../../styles/addRecordModal.css";

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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(recordToAdd),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Disco agregado exitosamente!');
        onAddRecord(data.record);
        onHide(); 
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
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="modal-title">Selecciona un Disco para Agregar</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <ListGroup>
          {apiData &&
            apiData.map((record) => (
              <ListGroup.Item
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={`record-list-item ${selectedRecord?.id === record.id ? 'selected' : ''}`}
              >
                <img
                  src={record.cover_image}
                  alt={record.title}
                  className="record-list-item__image"
                />
                {record.title} - {record.year}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button variant="secondary" onClick={onHide} className="btn-secondary">
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={handleAddRecord}
          disabled={!selectedRecord}
          className="btn-primary"
        >
          Agregar Disco
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRecordModal;


