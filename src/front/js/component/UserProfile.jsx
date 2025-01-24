import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const UserProfile = ({ userId }) => {
  const { store, actions } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (userId) {
      actions.getUserData(userId);
    }
  }, [userId, actions]);

  useEffect(() => {
    if (store.user) {
      setLoading(false);
    }
  }, [store.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    actions.setStore({ [name]: value });
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
      setSuccessMessage(data.msg);
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
  if (error) return <p className="user-profile-error-message">{error}</p>;

  return (
    <div className="user-profile-component-container">
      <Link to={"/private"} className="user-profile-back-button">
        <h1>Back</h1>
      </Link>
      <div className="user-profile-component-card">
        <h2>Mis Datos de Usuario</h2>

        {successMessage && <p className="user-profile-success-message">{successMessage}</p>}

        {isEditing ? (
          <div>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                name="name"
                value={store.user.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={store.user.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={store.user.password || ""}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={handleSave}>Guardar</button>
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
              <strong>Contraseña:</strong> ****** {/* Ocultamos la contraseña */}
            </p>
            <button onClick={() => setIsEditing(true)}>Editar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
