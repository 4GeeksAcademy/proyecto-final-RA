import React, { useContext, useEffect } from "react";
import "../../styles/misDiscosFavorites.css";
import { Context } from "../store/appContext";

export const FavoritosComponent = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getWishList();
    }, []);

    return (
        <div className="mis-discos-container">
            <h1 className="text-center">Mis Favoritos ❤️</h1>
            {store.wishList && store.wishList.length > 0 ? (
                <div className="favorites-grid">
                    {store.wishList.map((fav, index) => (
                        <div key={index} className="favorite-card">
                            <img src={fav.record_cover_image} alt={fav.record_title} className="favorite-image" />
                            <div className="favorite-details">
                                <h3>{fav.record_title}</h3>
                                <p><strong>Artista:</strong> {fav.record_title}</p>
                                <p><strong>Año:</strong> {fav.record_year}</p>
                                <p><strong>Sello:</strong> {fav.record_label.replace(/{|}/g, "") || "Sin sello"}</p>
                                <p><strong>Género:</strong> {fav.record_genre.replace(/{|}/g, "") || "Sin género"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">No tienes favoritos aún.</p>
            )}
        </div>
    );
};
