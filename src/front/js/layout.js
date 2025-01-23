import React from "react";
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
import SearchMusic from "./component/searchMusic.jsx";
import SearchWorldWide from "./component/searchWorldWide.jsx";
import AboutUs from "./component/aboutUs.jsx";
import MiPerfil from "./component/miPerfil.jsx";
import DiscosEnVenta from "./component/discosEnVenta.jsx";


//create your first component
const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<MisDiscos />} path="/mis-discos" />
                        <Route element={<DiscosEnVenta />} path="/sell-list" />
                        <Route element={<MiPerfil />} path="/mi-perfil" />
                        <Route element={<SearchMusic />} path="/searchmusic" />
                        <Route element={<SearchWorldWide />} path="/searchworldwide" />
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

