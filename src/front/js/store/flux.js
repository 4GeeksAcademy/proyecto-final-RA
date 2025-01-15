const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            records: [],   // Aquí almacenaremos los registros obtenidos de la API
            loading: false, // Indicador de carga
            error: null,    // Almacenará posibles errores
        },
        actions: {
            register: async (formData) => {
				try {
				const resp = await fetch('https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/register' , {
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
					return  true
			} catch (error) {
				console.log(error)
				return false
			}
			},

            login: async (formData) => {
				try {
				const resp = await fetch('https://fictional-succotash-rwgj44xqwvj2pjr4-3001.app.github.dev/api/login' , {
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
					return  true
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
						setStore({user: data.user})
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
            fetchDiscogsRecords: async (query) => {
                if (!query) return; // Evitar consultas vacías
                const store = getStore();
                const token = "KICgBsOUcAETzwuzpfafDmhRVgkEwPmxpPIzsxmK"; // Tu token Discogs
                const url = `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&token=${token}`;

                setStore({ ...store, loading: true });

                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("Error fetching records");

                    const data = await response.json();
                    const actions = getActions();
                    actions.setRecords(data.results);
                } catch (error) {
                    const actions = getActions();
                    actions.setError(error.message || "An error occurred");
                }
            },
        },
    };
};

export default getState;
