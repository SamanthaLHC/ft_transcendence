import React from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Home from "../home/Home";

function App() {
	return (
		<Routes>
			<Route path={"/"} element={<Login />} />
			<Route path={"/home"} element={<Home />} />
			{/* <Route path={"/chat"} element={<Chat />} /> */}
			{/* <Route path={"/game"} element={<Game />} /> */}
		</Routes>
	)
}

export default App


// TODO add route 2fa
// TODO add route error 400