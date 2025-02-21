import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/components/_MiPerfil.css"; 

const MiPerfil = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!store.user) {
                const isValid = await actions.validateToken();
                if (!isValid) {
                    navigate("/login");
                }
            }
            setIsLoading(false);
        }
        fetchData();
    }, [navigate, store.user, actions]);

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
            setIsLoading(true);
            const result = await actions.editUser(updatedFields);
            if (result.success) {
                setMessage("Datos guardados correctamente.");
                setIsEditing(false);
                await actions.checkUser();
            } else {
                setMessage(result.error || "Error al guardar los cambios.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error inesperado al guardar los cambios.");
        } finally {
            setIsLoading(false);
        }
    };

    const HandleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.");

        if (confirmDelete) {
            try {
                setIsLoading(true);
                const result = await actions.HandleDelete();

                if (result.success) {
                    setMessage("Usuario eliminado con éxito.");
                    localStorage.removeItem("token");
                    navigate("/register");
                } else {
                    setMessage(result.error || "Error al eliminar el usuario.");
                }
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
                setMessage("Error inesperado al intentar eliminar el usuario.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return <p className="mi-perfil-loading">Cargando datos...</p>;
    }

    if (!store.user) return <p className="mi-perfil-loading">Cargando datos...</p>;

    return (
        <div className="mi-perfil-container">
            <div className="mi-perfil-card">
                {message && <p className="mi-perfil-message">{message}</p>}

                {isEditing ? (
                    <div className="mi-perfil-form">
                        <h2 className="mi-perfil-title">Mi Perfil</h2>
                        <div className="mi-perfil-field">
                            <input type="text" className="input-field" onChange={handleInputChange} name="name" placeholder="Nombre de Usuario" value={formData.name || ""} />
                        </div>
                        <div className="mi-perfil-field">
                            <input type="email" className="input-field" onChange={handleInputChange} name="email" placeholder="Correo Electrónico" value={formData.email || ""} required />
                        </div>
                        <div className="mi-perfil-field">
                            <input type="password" className="input-field" onChange={handleInputChange} name="password" placeholder="Contraseña" value={formData.password || ""} required />
                        </div>
                        <div className="mi-perfil-buttons">
                            <button onClick={handleSave} className="mi-perfil-btn-save">Guardar</button>
                            <button onClick={() => setIsEditing(false)} className="mi-perfil-btn-cancel">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className="mi-perfil-info">
                        <h2 className="mi-perfil-title">Mi Perfil</h2>
                        <p><strong className="mi-perfil-label">Nombre:</strong> {store.user?.name || "N/A"}</p>
                        <p><strong className="mi-perfil-label">Email:</strong> {store.user?.email || "N/A"}</p>
                        <div className="mi-perfil-buttons">
                            <button onClick={() => setIsEditing(true)} className="mi-perfil-btn-edit">Editar</button>
                            <button onClick={HandleDelete} className="mi-perfil-btn-delete">Eliminar Cuenta</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MiPerfil;
