import React, { useContext } from "react";
import { Context } from "../store/appContext";


import { Register } from "../component/register.jsx";
import SearchInvitados from "../component/SearchInvitados.jsx";
import RandomRecordsCarousel from "../component/RandomRecordsCarousel.jsx";

import "../../styles/home.css";
import { Jumbotron } from "../component/Jumbotron.jsx";

const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="container-fluid home-layout">
      <div className="home-layout__sidebar left-sidebar"></div>
      <div className="home-layout__content-wrapper">
        <Jumbotron />
        <SearchInvitados />
        <RandomRecordsCarousel />
      </div>
      <div className="home-layout__sidebar right-sidebar"></div>
    </div>
  );
};

export default Home;







