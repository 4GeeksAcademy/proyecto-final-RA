
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            records: [],  
            loading: false, 
            error: null,   
            user: null,
            results: [],
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
                    const resp = await fetch(process.env.BACKEND_URL+"/api/register", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    })
                    if (!resp.ok) throw new Error("Algo ha ido mal!")
                    const data = await resp.json()
                    localStorage.setItem('token', data.token)
                    console.log(data)
                    return true
                } catch (error) {
                    console.log(error)
                    return false
                }
            },

            login: async (formData) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL+"/api/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    })
                    if (!resp.ok) throw new Error("Algo ha ido mal!")
                    const data = await resp.json()
                    localStorage.setItem('token', data.token)
                    console.log(data)
                    return true
                } catch (error) {
                    console.log(error)
                    return false
                }
            },

            checkUser: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL+"/api/protected", {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    if (!resp.ok) throw new Error('Algo ha ido mal')
                    const data = await resp.json();
                    setStore({ user: data.user })
                    console.log(data)
                    return true
                } catch (error) {
                    console.error(error)
                    return false
                }
            },

        },

        // -------------------------------------------------------------------------------------

        editUser: async (userId, formData) => {
            try {
                // Realizamos la solicitud al backend
                const resp = await fetch(`https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/edit_user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData) // Convertimos el objeto formData a JSON
                });

                if (!resp.ok) throw new Error("Error al actualizar el usuario");

                const data = await resp.json(); // Obtenemos la respuesta del servidor
                console.log(data.msg); // Mensaje de éxito del backend
                return true;
            } catch (error) {
                console.error("Error al editar el usuario:", error);
                return false;
            }
        },
        // ------------------------------------------------------------------------------------------------------------------------
    };
};

export default getState;
