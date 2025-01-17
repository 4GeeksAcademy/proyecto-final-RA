const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            records: [],   // Aquí almacenaremos los registros obtenidos de la API
            loading: false, // Indicador de carga
            error: null,    // Almacenará posibles errores
            user: null,
        },
        actions: {
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

            // Acción para cambiar el estado a cargando
            setLoading: () => {
                const store = getStore();
                setStore({ ...store, loading: true });
            },

            // Acción para actualizar el estado con los registros obtenidos
            setRecords: (records) => {
                const store = getStore();
                setStore({ ...store, records, loading: false });
            },

            // Acción para manejar errores
            setError: (error) => {
                const store = getStore();
                setStore({ ...store, error, loading: false });
            },

            // Acción para hacer el fetch de los registros desde Discogs
            fetchDiscogsRecords: async (searchType, query) => {
                if (!query) return; // Evitar consultas vacías
                const store = getStore();
                const token = "KICgBsOUcAETzwuzpfafDmhRVgkEwPmxpPIzsxmK"; // Tu token Discogs

                // Configuración de la URL dependiendo del tipo de búsqueda
                let url;
                switch (searchType) {
                    case 'artist':
                        url = `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=artist&token=${token}`;
                        break;
                    case 'genre':
                        url = `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=genre&token=${token}`;
                        break;
                    case 'song':
                        url = `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&token=${token}`;
                        break;
                    case 'label':
                        url = `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=label&token=${token}`;
                        break;
                    default:
                        return; // Si el tipo no es válido, no hacer nada
                }

                console.log("------>",`https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=artist&token=${token}`);

                setStore({ ...store, loading: true });

                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("Error fetching records");

                    const data = await response.json();
                    const records = data.results.map(item => ({
                        title: item.title,
                        artist: item.artist,
                        image_url: item.cover_image,  // Suponiendo que el campo sea 'cover_image'
                        price: item.price || "N/A",   // Suponiendo que el campo sea 'price', si no existe usamos "N/A"
                    }));
                    const actions = getActions();
                    actions.setRecords(records);
                } catch (error) {
                    const actions = getActions();
                    actions.setError(error.message || "An error occurred");
                }
            },

        },

        // Nueva acción para agregar un disco a la tabla record
        // addRecord: async (record) => {
        //     const token = localStorage.getItem("token");
        //     const response = await fetch("http://localhost:5000/api/records", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${token}`,
        //         },
        //         body: JSON.stringify(record),
        //     });
        
        //     if (!response.ok) {
        //         const error = await response.json();
        //         console.error("Error al agregar el registro:", error);
        //         return false;
        //     }
        
        //     const data = await response.json();
        //     console.log("Registro agregado:", data);
        //     return true;
        // },
        
       
        
        
        
        
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

        searchDiscogs: async (query) => {
            try {
                const response = await fetch(`https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/search?q=${query}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) throw new Error("Error al buscar discos");
                const results = await response.json();
                console.log(results); // Mostrar resultados para seleccionarlos en el frontend
                return results; // Devolver la lista de discos al componente
            } catch (error) {
                console.error("Error al buscar discos:", error);
                return [];
            }
        },



    };
};

export default getState;
