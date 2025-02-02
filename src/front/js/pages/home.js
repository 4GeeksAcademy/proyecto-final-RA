import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import RecordsList from "../component/test.jsx"

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Fractal Kaotic Records!</h1>
			<RecordsList />
		</div>
	);
};
