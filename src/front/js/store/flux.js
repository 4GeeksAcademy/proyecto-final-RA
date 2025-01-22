const getState = ({ getStore, setStore, getActions }) => {
  return {
    store: {
      records: [],
      onSale: [],
      loading: false,
      error: null,
      user: null,
      searchResults: [],
      randomResults: [],
      isSearching: false,
      isFetchingRandom: false,
      randomFetched: false,
    },
    actions: {
      // Acción para buscar discos en Discogs
      searchDiscogs: async (query, searchBy) => {
        const store = getStore();

        // Si ya estamos buscando o cargando, no hacer nada
        if (store.loading || store.isSearching) {
          console.log("Ya estamos buscando o cargando. Espera un momento.");
          return;
        }

        setStore({
          isSearching: true,
          loading: true,
          error: null,
        });

        console.log("Iniciando búsqueda...");

        try {
          const resp = await fetch(
            `https://api.discogs.com/database/search?q=${query}&type=${searchBy}&key=kmEbvrXuklqaKnWubyqy&secret=LWhxEIMhJHQrPQTIqhpOZhzCRJeccZAV`
          );

          if (!resp.ok) {
            throw new Error("Error al obtener los resultados de Discogs");
          }

          const data = await resp.json();
          console.log("Respuesta de la API:", data);

          if (data.results && data.results.length > 0) {
            setStore({
              searchResults: data.results,
              loading: false,
              isSearching: false,
            });
            console.log("Resultados de búsqueda obtenidos:", data.results);
          } else {
            setStore({
              searchResults: [],
              loading: false,
              isSearching: false,
              error: "No se encontraron resultados",
            });
            console.log("No se encontraron resultados.");
          }
        } catch (error) {
          setStore({
            loading: false,
            error: error.message,
            isSearching: false,
          });
          console.error("Error en la búsqueda:", error);
        }
      },

      // Acción para obtener resultados aleatorios de Discogs
      FetchRandomRecords: async (q = "Drum & Bass") => {
        const store = getStore();

        if (store.isSearching || store.isFetchingRandom || store.randomFetched) {
          console.log("Ya estamos buscando o ya tenemos resultados aleatorios.");
          return;
        }

        setStore({
          isFetchingRandom: true,
          loading: true,
          error: null,
        });

        try {
          const resp = await fetch(
            `https://api.discogs.com/database/search?q=${q}&key=kmEbvrXuklqaKnWubyqy&secret=LWhxEIMhJHQrPQTIqhpOZhzCRJeccZAV`
          );

          if (!resp.ok) {
            throw new Error("Error al obtener los resultados aleatorios de Discogs");
          }

          const data = await resp.json();
          console.log("Respuesta de la API (resultados aleatorios):", data);

          if (data.results && data.results.length > 0) {
            setStore({
              randomResults: data.results,
              loading: false,
              isFetchingRandom: false,
              randomFetched: true,
            });
            console.log("Resultados aleatorios obtenidos:", data.results);
          } else {
            setStore({
              randomResults: [],
              loading: false,
              isFetchingRandom: false,
              randomFetched: true,
              error: "No se encontraron resultados aleatorios",
            });
            console.log("No se encontraron resultados aleatorios.");
          }
        } catch (error) {
          setStore({
            loading: false,
            error: error.message,
            isFetchingRandom: false,
            randomFetched: true,
          });
          console.error("Error al obtener resultados aleatorios:", error);
        }
      },

      // Función para registrar un nuevo usuario
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

      // Función para login de un usuario
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

      // Verificar el usuario logueado
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

      // Función para editar un usuario
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

      // Función para añadir un registro al backend
      addRecordToDatabase: async (recordData) => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No se encontró un token. Por favor, inicie sesión.");
          return;
        }

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
          button.disabled = false;
        }
      },

      getRecords: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + "/api/records");
          if (!response.ok) throw new Error("Error al obtener los registros");
          const data = await response.json();
          setStore({ records: data });
        } catch (error) {
          console.error("Error en getRecords:", error);
          setStore({ error: "No se pudieron cargar los registros" });
        }
      },

      getUserData: async (userId) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/users/${userId}`);
          if (!response.ok) throw new Error("Error al cargar los datos del usuario.");
          const data = await response.json();
          setStore({ user: data });
        } catch (err) {
          console.error("Error al obtener los datos del usuario:", err);
        }
      },

      setStore: (updatedStore) => {
        setStore(updatedStore);
      },

      setError: (errorMessage) => {
        setStore({ error: errorMessage });
      },

      addToSellList: async (recordId) => {
        const store = getStore();
        const userId = store.user?.id;  // Obtener el user_id desde el store
    
        // Verificar si el usuario está autenticado
        if (!userId) {
            setStore({ error: "Usuario no autenticado" });
            console.error("Usuario no autenticado");
            return;
        }
    
        // Configuración de la solicitud
        const token = localStorage.getItem("token");
        const button = document.getElementById(`addRecordButton-${recordId}`); // Usar el ID dinámico
        if (button) {
            button.disabled = true;  // Deshabilitar el botón mientras se realiza la solicitud
        }
    
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/sell_list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Enviar el token JWT en la cabecera
                },
                body: JSON.stringify({
                    record_id: recordId,  // Enviar el record_id y el user_id
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Disco agregado correctamente a la lista de ventas:", data);
                setStore({
                  onSale: [...store.onSale, { ...data.sell_list_entry, cover_image: data.sell_list_entry.cover_image }],
                });
            } else {
                setStore({ error: data.error || "Error al agregar el disco a la lista de ventas" });
                console.error("Error al agregar disco a la lista de ventas:", data.error);
            }
        } catch (error) {
            setStore({ error: "Hubo un error al intentar agregar el disco." });
            console.error("Error al realizar la solicitud:", error);
        } finally {
            if (button) {
                button.disabled = false;  // Habilitar el botón nuevamente
            }
        }
    },

      // Otros métodos de tu estado (por ejemplo, login, register, etc.)

      // Función para obtener los registros de la lista de ventas
      getSellList: async () => {
        const store = getStore(); // Obtener el estado actual del store
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/sell_list`);
          const data = await response.json();
          
          if (response.ok) {
            setStore({ onSale: data });  // Actualizar la lista de discos en el estado
          } else {
            setStore({ error: "Error al obtener la lista de ventas." });
          }
        } catch (error) {
          console.error("Error al obtener la lista de ventas:", error);
          setStore({ error: "Hubo un error al obtener la lista de ventas." });
        }
      },
    },
  };
};

export default getState;
