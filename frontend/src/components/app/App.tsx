import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Home from "../home/Home";
import Chat from "../chat/Chat";
import Game from "../game/Game";
import Settings from "../settings/Settings";
import Profil from "../profil/Profil"
import FriendPage from "../friends/FriendPage"
import Friends from "../friends/Friends";

function App() {
	return (
		<React.StrictMode>
			<Routes>
				<Route path={"/"} element={<Login />} />
				<Route path={"/home"} element={<Home />} />
				<Route path={"/chat"} element={<Chat />} />
				<Route path={"/game"} element={<Game />} />
				<Route path={"/settings"} element={<Settings/>} />
				<Route path={"/profil"} element={<Profil />} />
				<Route path={"/friend"} element={<FriendPage />} />
			</Routes>
		</React.StrictMode>
	)
}

export default App


// TODO add route 2fa
// TODO add route error 400