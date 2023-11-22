import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Login from "../auth/Login";
import Home from "../home/Home";
import Chat from "../chat/Chat";
import Game from "../game/Game";
import Settings from "../settings/Settings";
import Profil from "../profil/Profil"
import FriendPage from "../friends/FriendPage"
import Error from "../error/Error";
import TwoFaQRCodePage from "../auth/2fa/TwoFaQRCodePage";
import TwoFa from "../auth/2fa/TwoFa";
import { ChatSocketProvider, UserProvider } from "../Context"
import { useEffect } from 'react';
// import { useState } from 'react';
import { io } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import GameF from "../gamefriend/GameF";
import ErrorCafe from "../errorcafe/Error";

const App: React.FC = () => {
	console.log(process.env.REACT_APP_HOSTNAME)

	const params = useParams();
	const imageUrl = params.imageUrl || '';

	const [cookies] = useCookies(["access_token"]);
	// const [isLogged, setIslogged] = useState(false)
	useEffect(() => {
		const socket = io('http://' + process.env.REACT_APP_HOSTNAME + ':3000/status', {
			autoConnect: false,
		});
		if (cookies.access_token) {
			let token = cookies.access_token;
			socket.auth = { token };
			socket.connect()
			socket.on('connect', () => {
				console.log('Connected to server');
			});
			return () => {
				if (socket) {
					socket.off('connect')
					socket.disconnect();
				}
			}
		}
	}, [cookies.access_token]);

	return (
		<UserProvider>
		<ChatSocketProvider>
			<Routes>
				<Route path={"/"} element={<Login />} />
				<Route path={"/home"} element={<Home />} />
				<Route path={"/chat"} element={<Chat />} />
				<Route path={"/game"} element={<Game />} />
				<Route path={"/settings"} element={<Settings />} />
				<Route path={"/profil"} element={<Profil />} />
				<Route path={"/friend"} element={<FriendPage />} />
				<Route path={"/2fa"} element={<TwoFa />} />
				<Route path={"/gamefriend"} element={<GameF />} />
				<Route path="/qrcode/:imageUrl" element={<TwoFaQRCodePage imageUrl={imageUrl} />} />
				<Route path={"/cafe"} element={<ErrorCafe />} />
				<Route path={"*"} element={<Error />} />
			</Routes>
		</ChatSocketProvider>
		</UserProvider>
	)
}

export default App

//HERE add <PrivateRoute> with a isLog ?