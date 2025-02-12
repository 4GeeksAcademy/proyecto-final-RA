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
        password: "",
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

  const HandleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.");

    if (confirmDelete) {
        try {
            const result = await actions.HandleDelete(); // Nombre corregido

            if (result.success) {
                setMessage("Usuario eliminado con éxito.");
                window.location.href = "/login"; // Redirigir al login
            } else {
                setMessage(result.error || "Error al eliminar el usuario.");
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            setMessage("Error inesperado al intentar eliminar el usuario.");
        }
    }
};


  if (!store.user) return <p className="mi-perfil-loading">Cargando datos...</p>;

  return (
    <div className="mi-perfil-bg">
      <div className="mi-perfil-container">
        {message && <p className="mi-perfil-message">{message}</p>}

        {isEditing ? (
          <div className="mi-perfil-form">
            <h2 className="mi-perfil-title">Mi Perfil</h2>
            <div className="form-control">
              <div className="mi-perfil-field">
                <input
                  type="text"
                  className="input-field"
                  onChange={handleInputChange}
                  name="name"
                  placeholder="Nombre de Usuario"
                  value={formData.name || ""}
                />
              </div>
              <div className="mi-perfil-field">
                <input
                  type="email"
                  className="input-field"
                  onChange={handleInputChange}
                  name="email"
                  placeholder="Correo Electrónico"
                  value={formData.email || ""}
                  required
                />
              </div>
              <div className="mi-perfil-field">
                <input
                  type="password"
                  className="input-field"
                  onChange={handleInputChange}
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password || ""}
                  required
                />
              </div>
              <button onClick={handleSave} className="mi-perfil-btn-save toggle-button">
                Guardar
              </button>
              <button onClick={() => setIsEditing(false)} className="mi-perfil-btn-cancel toggle-button">
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
            <div className="mi-perfil-buttons">
              <button onClick={() => setIsEditing(true)} className="mi-perfil-btn-edit styled-button">
                Editar
              </button>
              <button onClick={HandleDelete} className="mi-perfil-btn-delete styled-button">
                Eliminar Cuenta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiPerfil;








