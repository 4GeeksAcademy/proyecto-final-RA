const getState = ({ getStore, setStore }) => {
  return {
    store: {
      records: [],
      loading: false,
      error: null,
      user: null,
      searchResults: [],
      randomResults: [],
      isSearching: false, // Indicador para saber si está buscando
      isFetchingRandom: false, // Indicador para los resultados aleatorios
      randomFetched: false, // Indicador para saber si ya se han obtenido resultados aleatorios
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

          // Verificamos si hay resultados y los asignamos
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

        // Si ya estamos buscando o tenemos resultados aleatorios, no hacer nada
        if (store.isSearching || store.isFetchingRandom || store.randomFetched) {
          console.log("Ya estamos buscando o ya tenemos resultados aleatorios.");
          return;
        }

        setStore({
          isFetchingRandom: true, // Indicador de que se está buscando resultados aleatorios
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

          // Verificamos si hay resultados y los asignamos
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
    },
  };
};

export default getState;




  
  
  
  

  
