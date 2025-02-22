import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Search from "../component/search.jsx";
// import "../../styles/private.css";
import "../../styles/components/_private.css"
import RecordCarousel from "./RecordCarousel.jsx";
import { Link } from "react-router-dom";
import SideBar from "./sideBar.jsx";


export const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
            } else {
                const isValidUser = await actions.checkUser();
                if (!isValidUser) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
            }
        };

        checkAuthentication();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="private-page-container d-flex flex-wrap">
  
            {/* <SideBar /> */}
            <div className="private-content">
                <Search />
            </div>
        </div>
    );
};

export default Private;

