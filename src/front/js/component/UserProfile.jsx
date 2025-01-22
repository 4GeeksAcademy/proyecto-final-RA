import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext"; // Importar el contexto global
import { Link } from"react-router-dom";

export const UserProfile = ({ userId }) => {
  const { store, actions } = useContext(Context); // Obtener el store y las acciones desde el contexto
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (userId) {
      actions.getUserData(userId); // Llamar a la acción para obtener los datos del usuario
    }
  }, [userId, actions]);

  useEffect(() => {
    if (store.user) {
      setLoading(false);
    }
  }, [store.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    actions.setStore({ [name]: value }); // Asegúrate de pasar el store correctamente
  };

  const handleSave = async () => {
    if (!store.user || !store.user.id) {
      setError("No se encontraron datos del usuario para guardar.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.BACKEND_URL}/edit_user/${store.user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(store.user),
        }
      );

      if (!response.ok) throw new Error("Error al guardar los cambios.");

      const data = await response.json();
      setSuccessMessage(data.msg); // Mostrar mensaje de éxito
      setIsEditing(false);
      alert("Datos guardados correctamente.");
    } catch (err) {
      console.error("Error al guardar los cambios:", err);
      setError("Error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Link to={"/private"}>
        <h1>Back</h1>
      </Link>
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

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}{" "}
      {/* Mostrar mensaje de éxito */}

      {isEditing ? (
        <div>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={store.user.name || ""}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={store.user.email || ""}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={store.user.password || ""}
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
            <strong>Nombre:</strong> {store.user.name}
          </p>
          <p>
            <strong>Email:</strong> {store.user.email}
          </p>
          <p>
            <strong>Contraseña:</strong> ******
          </p>
          <button onClick={() => setIsEditing(true)} style={{ marginRight: "0.5rem" }}>
            Editar
          </button>
        </div>
      )}
    </div>
    </div>
  );
};
