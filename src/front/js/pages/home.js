import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/index.css";
import RecordsList from "../component/test.jsx";
import { Register } from "../component/register.jsx";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container-fluid text-center mt-5">
			            <video
                className="video-background"
                autoPlay
                loop
                muted
                playsInline
            >
                <source
                    src="https://media.istockphoto.com/id/513338642/es/v%C3%ADdeo/espeluznante-paso-asnivel.mp4?s=mp4-640x640-is&k=20&c=gG2bpJ92AZUzMyXblLqWLCX6V0YdhB-6Mryn5jd9X3A="
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
			{/* <h1>Street Records!</h1> */}
			<RecordsList />
		</div>
	);
};
