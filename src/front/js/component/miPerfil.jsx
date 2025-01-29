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

  if (!store.user) return <p className="mi-perfil-loading">Cargando datos...</p>;

  return (
    <div className="mi-perfil-bg">
      <div className="mi-perfil-container">
        <h2 className="mi-perfil-title">Mis Datos de Usuario</h2>
        {message && <p className="mi-perfil-message">{message}</p>}

        {isEditing ? (
          <div className="form-container mi-perfil-form">
            <h2>Mi Perfil</h2>
            <div className="form-control">
              <div className="input-field">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Nombre"
                />
              </div>
              <div className="input-field">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Correo electrónico"
                />
              </div>
              <div className="input-field">
                <label>Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Contraseña"
                />
              </div>
              <button onClick={handleSave} className="submit-btn-css">
                Guardar
              </button>
              <button onClick={() => setIsEditing(false)} className="toggle-button">
                Cancelar
              </button>
            </div>
          </div>

        ) : (
          <div>
            <p>
              <strong className="text-black">Nombre:</strong> {store.user?.name || "N/A"}
            </p>
            <p>
              <strong className="text-black">Email:</strong> {store.user?.email || "N/A"}
            </p>
            <button onClick={() => setIsEditing(true)} className="mi-perfil-btn-edit">
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiPerfil;

