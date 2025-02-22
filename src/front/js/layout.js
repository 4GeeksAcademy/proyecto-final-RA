import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import Home from "./pages/home";  // Corrected: default import
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import Navbar from "./component/navbar";
import Register from "./component/register.jsx";
import Footer from "./component/footer";
import Private from "./component/private.jsx";
import MisDiscos from "./component/misDiscos.jsx";
// import { SearchMusic } from "./component/searchMusic.jsx";
import BuscarEnPlataforma from "./component/BuscarEnPlataforma.jsx";
import SearchLocal from "./component/searchLocal.jsx";
import AboutUs from "./component/aboutUs.jsx"
import { MiPerfil } from "./component/miPerfil.jsx"
import DiscosEnVenta from "./component/discosEnVenta.jsx";
import { MiPerfilContainer } from "./component/miPerfilContainer.jsx";
import { FavoritosVista } from "./component/FavoritosVista.jsx";

import { Context } from './store/appContext';
import SideBar from "./component/sideBar.jsx";



//create your first component
const Layout = () => {
    const basename = process.env.BASENAME || "";
    const { store } = useContext(Context);

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<MisDiscos />} path="/mis-discos" />
                        <Route element={<FavoritosVista />} path="/vista-favoritos" />
                        <Route element={<DiscosEnVenta />} path="/sell-list" />
                        <Route element={<MiPerfilContainer />} path="/mi-perfil-container" />
                        {/* <Route element={<MiPerfil />} path="/mi-perfil" /> */}
                        {/* <Route element={<SearchMusic />} path="/searchmusic" /> */}
                        <Route element={<BuscarEnPlataforma />} path="/buscarenrsb" />
                        {/* <Route element={<SearchLocal />} path="/search-local" /> */}
                        <Route element={<Register />} path="/register" />
                        <Route element={<Private />} path="/private" />
                        <Route element={<AboutUs />} path="/aboutus" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);

