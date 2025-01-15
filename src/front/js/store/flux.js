const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            records: [],   // Aquí almacenaremos los registros obtenidos de la API
            loading: false, // Indicador de carga
            error: null,    // Almacenará posibles errores
        },
        actions: {
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
