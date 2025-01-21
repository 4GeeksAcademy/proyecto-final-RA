const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            records: [],
            loading: false,
            error: null,
            user: null,
            results: [],
            // collection: [],
        },
        actions: {
            searchDiscogs: async (query) => {
                setStore({ loading: true, error: null });
                try {
                    const resp = await fetch(`https://api.discogs.com/database/search?q=${query}&key=kmEbvrXuklqaKnWubyqy&secret=LWhxEIMhJHQrPQTIqhpOZhzCRJeccZAV`);
                    if (!resp.ok) {
                        throw new Error("Error al obtener los resultados de Discogs");
                    }
                    const data = await resp.json();
                    setStore({ results: data.results, loading: false });
                    console.log(data);
                } catch (error) {
                    setStore({ loading: false, error: error.message });
                    console.error(error);
                }
            },

            register: async (formData) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/register", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    if (!resp.ok) throw new Error("Algo ha ido mal!");
                    const data = await resp.json();
                    localStorage.setItem('token', data.token);
                    console.log(data);
                    return true;
                } catch (error) {
                    console.error(error);
                    return false;
                }
            },

            login: async (formData) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    if (!resp.ok) throw new Error("Algo ha ido mal!");
                    const data = await resp.json();
                    localStorage.setItem('token', data.token);
                    console.log(data);
                    return true;
                } catch (error) {
                    console.error(error);
                    return false;
                }
            },

            checkUser: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/protected", {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    if (!resp.ok) throw new Error('Algo ha ido mal');
                    const data = await resp.json();
                    setStore({ user: data.user });
                    console.log("INFO de Usuario ===>", data.user.id);
                    return true;
                } catch (error) {
                    console.error(error);
                    return false;
                }
            },

            editUser: async (userId, formData) => {
                try {
                    const resp = await fetch(`https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/edit_user/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    if (!resp.ok) throw new Error("Error al actualizar el usuario");
                    const data = await resp.json();
                    console.log(data.msg);
                    return true;
                } catch (error) {
                    console.error("Error al editar el usuario:", error);
                    return false;
                }
            },

            addRecordToDatabase:async (recordData) => {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("No se encontró un token. Por favor, inicie sesión.");
                    return;
                }
                
                // Deshabilitar el botón mientras se procesa
                const button = document.getElementById("addRecordButton");
                button.disabled = true;
            
                try {
                    const response = await fetch('https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/add_record', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(recordData),
                    });
                    const result = await response.json();
                    if (response.ok) {
                        console.log("Disco agregado correctamente:", result);
                    } else {
                        console.error("Error al agregar disco:", result.error);
                        alert("Error al agregar disco: " + result.error);
                    }
                } catch (error) {
                    console.error("Error de conexión:", error);
                    alert("Hubo un error al intentar conectar con el servidor.");
                } finally {
                    // Habilitar nuevamente el botón después de procesar
                    button.disabled = false;
                }
            },
            

            // addRecordToCollection: (record) => {
            //     const store = getStore();
            //     const exists = store.records.some(item => item.id === record.id);
            //     if (!exists) {
            //         setStore({
            //             ...store,
            //             records: [...store.records, record],
            //         });
            //     }
            // },
        },
    };
};

export default getState;
