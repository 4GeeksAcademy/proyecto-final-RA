import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
// import '../../styles/components/_favoritosComponent.css';

export const FavoritosComponent = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getWishList();
  }, []);

  const renderWishlist = () => {
    if (store.wishList && store.wishList.length > 0) {
      return (
        <div className="mis-discos-container row g-3">
          {store.wishList.map((fav, index) => {
            const coverImage = fav?.record_cover_image;
            const title = fav?.record_title;
            const artist = fav?.record_artist;
            const year = fav?.record_year;
            const label = fav?.record_label;
            const genre = fav?.record_genre;

            return (
              <div key={index} className="d-flex mis-discos-container col-6 col-md-4 col-lg-3 col-xl-2 mb-4 ">
                <div className="card bg-dark text-white h-100">
                  {coverImage && (
                    <img
                      src={coverImage}
                      className="card-img-top"
                      alt={title || "Imagen del disco"}
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title text-truncate">
                      {title || "Título desconocido"}
                    </h5>
                    <div className="card-text small">
                      <p className="mb-1 text-truncate">
                        <strong>Artista:</strong> {artist || "Desconocido"}
                      </p>
                      <p className="mb-1 text-truncate">
                        <strong>Sello:</strong>{" "}
                        {label ? label.replace(/{|}/g, "") : "Sin sello"}
                      </p>
                      <p className="mb-1">
                        <strong>Año:</strong> {year || "Desconocido"}
                      </p>
                      <p>
                        <strong>Género:</strong>{" "}
                        {genre ? genre.replace(/{|}/g, "") : "Sin género"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (store.isLoading) {
      return <p className="text-center">Cargando...</p>;
    } else {
      return <p className="text-center">No tienes favoritos aún.</p>;
    }
  };

  return (
    <div className="mis-discos container py-4 col-12">
      <h1 className="mis-discos-title text-warning text-center mb-4">
        Mis Favoritos ❤️
      </h1>
      {renderWishlist()}
    </div>
  );
};
