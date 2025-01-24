// src/js/component/MiPerfil.jsx
import React, { useContext } from "react";
import UserProfile from "./UserProfile.jsx";
import { Context } from "../store/appContext";
import "../../styles/miPerfil.css";

export const MiPerfil = () => {
  const { store } = useContext(Context);

  // Verificar si hay datos del usuario antes de renderizar el perfil
  if (!store.user) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    <div>
      <UserProfile userId={store.user.id} />
    </div>
  );
};
