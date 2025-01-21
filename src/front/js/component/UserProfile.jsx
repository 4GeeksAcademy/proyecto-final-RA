import React, { useState, useEffect } from "react";

export const UserProfile = () => {
  // Estado inicial con los datos del usuario
  const [userData, setUserData] = useState({
    id: "", // Agregado para incluir ID del usuario
    name: "",
    email: "",
    password: "", // Mostrar solo como placeholder
  });

  const [isEditing, setIsEditing] = useState(false); // Estado para manejar si estamos en modo edición
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  const endpoint = "https://legendary-space-robot-x594x66jxgrg2pv4-3001.app.github.dev/edituser"; // URL del endpoint PUT

  // Obtener los datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async (id) => {
      try {
        const response = await fetch(`https://legendary-space-robot-x594x66jxgrg2pv4-3000.app.github.dev/users/${id}`); // Usamos comillas invertidas para la plantilla
        if (!response.ok) throw new Error("Error al cargar los datos del usuario.");
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError("Error al cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    // Asegúrate de pasar el 'id' a la función fetchUserData
    const userId = "some_user_id"; // Aquí deberías obtener el ID dinámicamente de tu estado o props
    fetchUserData(userId);
}, []);  // Si necesitas que 'id' cambie y haga una nueva petición, añádelo a las dependencias

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Guardar los cambios
  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Error al guardar los cambios.");
      setIsEditing(false);
      alert("Datos guardados correctamente.");
    } catch (err) {
      setError("Error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Perfil de Usuario</h2>

      {isEditing ? (
        <div>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
          </div>
          <button onClick={handleSave} style={{ marginRight: "0.5rem" }}>Guardar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      ) : (
        <div>
          <p><strong>Nombre:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Contraseña:</strong> ******</p>

          <button onClick={() => setIsEditing(true)} style={{ marginRight: "0.5rem" }}>Editar</button>
        </div>
      )}
    </div>
  );
};

