const getState = ({ getStore, setStore, getActions }) => {
  return {
    store: {
      records: [],
      loading: false,
      error: null,
      user: null,
      searchResults: [],
      randomResults: [],
      isSearching: false,
      isFetchingRandom: false,
      randomFetched: false,
      onSale: [],
    },
    actions: {
      searchDiscogs: async (query, searchBy) => {
        const store = getStore();

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
            `https://api.discogs.com/database/search?q=${query}&key=kmEbvrXuklqaKnWubyqy&secret=LWhxEIMhJHQrPQTIqhpOZhzCRJeccZAV`
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


      editUser: async (updatedData) => {
        try {
          // Verificar token
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token no encontrado.");
            return { success: false, error: "No se encontró un token válido" };
          }
      
          // URL del backend
          const BACKEND_URL = process.env.BACKEND_URL;
      
          // Enviar la solicitud al servidor
          const response = await fetch(`${BACKEND_URL}/api/edit_user`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          });
      
          // Manejar errores del servidor
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al editar usuario:", errorData.msg || response.statusText);
            return {
              success: false,
              error: errorData.msg || "Error desconocido al actualizar el usuario",
            };
          }
      
          // Procesar respuesta
          const data = await response.json();
          console.log("Usuario actualizado con éxito:", data);
          return { success: true, data };
      
        } catch (error) {
          console.error("Error al conectar con el backend:", error.message);
          return { success: false, error: "Error de conexión con el servidor" };
        }
      },
      

      addRecord: async (record) => {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No se encontró el token. Asegúrate de haber iniciado sesión.");
        }

        try {
          const response = await fetch(process.env.BACKEND_URL + '/api/add_record', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: record.title,
              label: record.label,
              year: record.year,
              genre: record.genre,
              style: record.style,
              cover_image: record.cover_image,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al agregar el disco");
          }

          const data = await response.json();
          return data;

        } catch (error) {
          console.error("Error al agregar el disco:", error);
          throw error;
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
          console.log("Fetching user data for ID:", userId);
          console.log("Fetching user data from URL:", `${process.env.BACKEND_URL}api/users/${userId}`);

          const response = await fetch(`${process.env.BACKEND_URL}api/users/${userId}`);
          if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
          }
          const data = await response.json();
          setStore({ user: data });
        } catch (err) {
          console.error("Error al obtener los datos del usuario:", err.message);
        }
      },

      setStore: (updatedStore) => {
        setStore(updatedStore);
      },

      deleteRecord: async (userId, recordId) => {
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}api/records/${recordId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user_id: userId }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar el disco");
          }

          const data = await response.json();

          // Actualizar los registros en el store
          const updatedRecords = getStore().records.filter(record => record.id !== recordId);
          setStore({ records: updatedRecords });

          return { success: true, msg: data.msg };
        } catch (error) {
          console.error("Error al eliminar el disco:", error.message);
          return { success: false, error: error.message };
        }
      },


      deleteSellListRecord: async (userId, recordId) => {
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}api/sell_lista/${recordId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user_id: userId }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar el disco");
          }

          const data = await response.json();

          // Actualizar los registros en el store
          const updatedRecords = getStore().onSale.filter(record => record.id !== recordId);
          setStore({ onSale: updatedRecords });

          return { success: true, msg: data.msg };
        } catch (error) {
          console.error("Error al eliminar el disco:", error.message);
          return { success: false, error: error.message };
        }
      },





      getSellList: async () => {
        try {
          const response = await fetch(process.env.BACKEND_URL + '/api/sell_lista', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            getActions().setSellList(data.sellList);
          } else {
            throw new Error('Error al cargar la lista de discos');
          }
        } catch (error) {
          setStore({ error: error.message });
        }
      },

      addToSellList: async (userId, recordId) => {
        try {

          if (!userId || !recordId) {
            throw new Error('userId y record.id son requeridos');
          }

          const response = await fetch(process.env.BACKEND_URL + '/api/sell_list', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ user_id: userId, record_id: recordId }),
          });


          if (response.ok) {
            const data = await response.json();
            console.log("Disco agregado a la lista de ventas", data);

          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al agregar el disco');
          }
        } catch (err) {
          console.error("Error al agregar el disco:", err);
          setStore({ error: err.message });
        }
      },

      setErrorMessage: (message) => {
        return {
          type: "SET_ERROR_MESSAGE",
          payload: message,
        };
      },

      setSellList: (onSale) => {
        setStore({ onSale });
      },
    },
  };
};

export default getState;










