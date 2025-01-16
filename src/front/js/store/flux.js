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
                    const resp = await fetch('https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/register', {
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
                    const resp = await fetch('https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/login', {
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
                    const resp = await fetch('https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/protected', {
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

		 // Nueva acción para agregar un disco a la colección
		 addToCollection: async (recordId) => {
			const store = getStore();
			const token = localStorage.getItem('token'); // Obtener el token desde el localStorage

			if (!token) {
				console.log("No hay token disponible.");
				return;
			}

			try {
				const response = await fetch('https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/add_to_collection', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`, // Se incluye el token en el header
					},
					body: JSON.stringify({ record_id: recordId }), // El ID del disco a agregar
				});

				if (!response.ok) throw new Error("Error al agregar el disco a la colección");

				const data = await response.json();
				console.log(data.msg); // Mensaje de éxito o error

				// Si es necesario, podrías actualizar el estado de la colección aquí
				// Ejemplo: setStore({ ...store, userCollection: data.collection });

			} catch (error) {
				console.error("Error al agregar el disco:", error);
			}
		},





    };
};

export default getState;
