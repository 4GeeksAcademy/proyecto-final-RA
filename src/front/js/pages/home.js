import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import Test from "../component/test.jsx";
import { Register } from "../component/register.jsx";
import  DiscogsSearch  from "../component/discogsSearch.jsx"

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container-fluid text-center cuerpo">
            <DiscogsSearch />
			            {/* <video
                className="video-background"
                autoPlay
                loop
                muted
                playsInline
            >
                <source
                    src="https://cdn.pixabay.com/video/2024/02/23/201735-916310640_large.mp4"
                    //  src="https://media.istockphoto.com/id/513338642/es/v%C3%ADdeo/espeluznante-paso-asnivel.mp4?s=mp4-640x640-is&k=20&c=gG2bpJ92AZUzMyXblLqWLCX6V0YdhB-6Mryn5jd9X3A="
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video> */}
			
		</div>
	);
};
