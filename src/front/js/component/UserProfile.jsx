import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const UserProfile = ({ userId }) => {
  const { store, actions } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (userId) {
      actions.getUserData(userId);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    actions.setStore({
      user: {
        ...store.user,
        [name]: value,
      },
    });
  };

  const handleSave = async () => {
    try {
      if (!userId || !store.user) {
        setMessage("No se encontraron datos del usuario para actualizar.");
        return;
      }
    

      const result = await actions.editUser(userId, store.user); // Asegúrate de que esta acción esté configurada en flux.js
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
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Mis Datos de Usuario</h2>
      {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}

      {isEditing ? (
        <div>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={store.user?.name || ""}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={store.user?.email || ""}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={store.user?.password || ""}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </div>
          <button onClick={handleSave} style={{ marginRight: "0.5rem" }}>
            Guardar
          </button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Nombre:</strong> {store.user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {store.user?.email || "N/A"}
          </p>
          <button onClick={() => setIsEditing(true)} style={{ marginRight: "0.5rem" }}>
            Editar
          </button>
        </div>
      )}
    </div>
  );
};
