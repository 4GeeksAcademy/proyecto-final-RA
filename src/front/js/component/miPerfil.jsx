import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/userProfile.css";

export const MiPerfil = () => {
  const { store, actions } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (store.user) {
      setFormData({
        name: store.user.name || "",
        email: store.user.email || "",
        password: "", // La contraseña no se muestra por razones de seguridad
      });
    }
  }, [store.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!store.user) {
        setMessage("No se encontraron datos del usuario para actualizar.");
        return;
      }

      const updatedFields = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== store.user[key] && (key !== "password" || formData[key] !== "")) {
          updatedFields[key] = formData[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        setMessage("No se realizaron cambios en los datos.");
        return;
      }

      const result = await actions.editUser(updatedFields);
      if (result.success) {
        setMessage("Datos guardados correctamente.");
        setIsEditing(false);
      } else {
        setMessage(result.error || "Error al guardar los cambios.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error inesperado al guardar los cambios.");
    }
  };

  if (!store.user) return <p>Cargando datos...</p>;

  return (
    <div className="container-fluid bg-dark">
    <div className="user-container">
      <h2>Mis Datos de Usuario</h2>
      {message && <p className="message">{message}</p>}

      {isEditing ? (
        <div>
          <div>
            <label>Nombre:</label>
            <input
              className="input-field"
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              className="input-field"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              className="input-field"
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleSave} className="submit-btn">
            Guardar
          </button>
          <button onClick={() => setIsEditing(false)} className="toggle-button">
            Cancelar
          </button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Nombre:</strong> {store.user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {store.user?.email || "N/A"}
          </p>
          <button onClick={() => setIsEditing(true)} className="submit-btn">
            Editar
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default MiPerfil;
