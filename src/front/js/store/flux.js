const getState = ({ getStore, setStore, getActions }) => {
  return {
    store: {
      records: [],
      loading: false,
      error: null,
      user: null,
      users: {},
      searchResults: [],
      randomResults: [],
      isSearching: false,
      isFetchingRandom: false,
      randomFetched: false,
      onSale: [],
      favorites: [],
      currentUser: null,
      likes: {},
      wishList: [],
    },
    actions: {
      toggleLike: (recordId) => {
        const store = getStore();
        setStore({
          likes: {
            ...store.likes,
            [recordId]: store.likes[recordId] ? store.likes[recordId] + 1 : 1
          }
        });
      },
      removeLike: (recordId) => {
        const store = getStore();
        if (store.likes[recordId] && store.likes[recordId] > 0) {
          setStore({
            likes: {
              ...store.likes,
              [recordId]: store.likes[recordId] - 1
            }
          });
        }
      },


      getWishList: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token no encontrado.");
            return { success: false, error: "No se encontró un token válido" };
          }

          const response = await fetch(process.env.BACKEND_URL + "/api/wishlist", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) throw new Error("Error al obtener la lista de favoritos");

          const data = await response.json();

          setStore({ wishList: data });
        } catch (error) {
          console.error("Error en getWishList:", error);
          setStore({ error: "No se pudieron cargar los favoritos" });
        }
      },





      addToWishlist: async (recordId, userId) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/wishlist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              record_id: recordId,
              user_id: userId
            })
          });

          if (!response.ok) {
            throw new Error("Error al agregar el disco a la wishlist.");
          }

          actions.fetchWishlist(userId);
        } catch (error) {
          console.error("Error al agregar a la wishlist:", error.message);
        }
      },

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
          console.log("INFO de Usuario ===>", data.user.email);
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      editUser: async (updatedData) => {
        try {

          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token no encontrado.");
            return { success: false, error: "No se encontró un token válido" };
          }

          const BACKEND_URL = process.env.BACKEND_URL;

          const response = await fetch(`${BACKEND_URL}/api/edit_user`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al editar usuario:", errorData.msg || response.statusText);
            return {
              success: false,
              error: errorData.msg || "Error desconocido al actualizar el usuario",
            };
          }

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
              Authorization: `Bearer ${token}`,
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
          getActions().getRecords()
          return data;

        } catch (error) {
          console.error("Error al agregar el disco:", error);
          throw error;
        }
      },

      getRecords: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token no encontrado.");
            return { success: false, error: "No se encontró un token válido" };
          }

          const response = await fetch(process.env.BACKEND_URL + "/api/records", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
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
          // Comprobar si el usuario ya está en el store
          const store = getStore();
          if (store.users[userId]) {
            console.log("Usuario ya presente en el store:", store.users[userId]);
            return;
          }

          console.log("Fetching user data for:", userId);
          const response = await fetch(`${process.env.BACKEND_URL}/api/user/${userId}`);
          const data = await response.json();
          setStore({
            users: {
              ...store.users,
              [userId]: data,
            },
          });
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
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


          const updatedRecords = getStore().onSale.filter(record => record.id !== recordId);
          setStore({ onSale: updatedRecords });

          return { success: true, msg: data.msg };
        } catch (error) {
          console.error("Error al eliminar el disco:", error.message);
          return { success: false, error: error.message };
        }
      },





      getSellList: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado.");
          return { success: false, error: "No se encontró un token válido" };
        }
        try {

          const response = await fetch(process.env.BACKEND_URL + '/api/sell_lista', {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error("Error al obtener los registros");
          const data = await response.json();
          console.log("Datos recibidos:", data);

          if (!data.sellList) throw new Error("sellList no encontrado en la respuesta");

          setStore({ onSale: data.sellList });
        } catch (error) {
          console.error("Error en getRecords:", error);
          setStore({ error: "No se pudieron cargar los registros" });
        }
      },

      addToSellList: async (userId, recordId) => {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No se encontró el token. Asegúrate de haber iniciado sesión.");
        }
        try {

          if (!userId || !recordId) {
            throw new Error('userId y record.id son requeridos');
          }

          const response = await fetch(process.env.BACKEND_URL + '/api/sell_list', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ user_id: userId, record_id: recordId }),
          });


          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error en la solicitud"); v
          }

          return await response.json();
        } catch (error) {
          console.error("Error al agregar el disco:", error);
          throw error;
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

deleteUser: async () => {
  const token = localStorage.getItem("token"); // Si usas autenticación con JWT
  try {
      const response = await fetch(process.env.BACKEND_URL + "/api/user", {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Si es necesario
          },
      });

      if (!response.ok) throw new Error("Error al eliminar el usuario");

      localStorage.removeItem("token"); // Limpia el token si se usó
      return { success: true };
  } catch (error) {
      console.error("Error en deleteUser:", error);
      return { success: false, error: error.message };
  }
}


export default getState;










