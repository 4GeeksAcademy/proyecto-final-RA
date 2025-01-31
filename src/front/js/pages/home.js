import React, { useContext } from "react";
import { Context } from "../store/appContext";


import { Register } from "../component/register.jsx";
import SearchInvitados from "../component/SearchInvitados.jsx";
import RandomRecordsCarousel from "../component/RandomRecordsCarousel.jsx";

import "../../styles/home.css";

const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="container-fluid home-layout">
      <div className="home-layout__sidebar left-sidebar"></div>
      <div className="home-layout__content-wrapper">
        <h1 className="home-layout__content-wrapper__welcome-title">
          ¡Bienvenido a Record Swappers Blog!
        </h1>
        <p className="home-layout__content-wrapper__welcome-subtitle">
          ¡Explora, encuentra tus discos favoritos y más!
        </p>

        <SearchInvitados />
        <RandomRecordsCarousel />
      </div>
      <div className="home-layout__sidebar right-sidebar"></div>
    </div>
  );
};

export default Home;







