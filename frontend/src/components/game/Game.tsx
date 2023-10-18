import React, { useEffect, useState } from 'react'
import ducky from '../../assets/fire.gif'
import win from '../../assets/win.gif'
import loose from '../../assets/ulgyLEg.gif'
import coin from '../../assets/canard.mp3'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import io from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Canvas from './Canvas'

let canardmod = false
let finish = false
let id = ""

const Game: React.FC = () => {
	let logindroite = ""
	let logingauche = ""
	const [cookies] = useCookies(["access_token"]);
	const navToHome = useNavigate();
	const gamefinish = () => {
		let pathHome: string = '/home';
		finish = false
		id = ""
		navToHome(pathHome);
	}
	const [data, setData] = useState(null);
	const getnamebyid = async (id: string): Promise<string> => {
		try {
			const req = new Request(`http://localhost:3000/users/id/${id}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			});

			const response = await fetch(req);

			if (response.ok) {
				const user = await response.json();
				return user.name
			} else {
				console.log("request failed");
				return "Unknown";
			}
		} catch (error) {
			console.error("An error occurred while fetching user data:", error);
			return "Unknown";
		}
	}
	useEffect(() => {

		const socket = io('http://localhost:3000/game', {
			autoConnect: false,
		});
		let token = cookies.access_token;
		socket.auth = { token };
		socket.connect()
		// setSocket(socketInstance);

		// listen for events emitted by the server

		socket.on('connect', () => {
			console.log('Connected to server');
			id = socket.id
		});

		socket.on('connect_room', (data) => {
			console.log(`Received conect room: ${data}`);
			setData(data)
		});
		socket.on('update', (data) => {
			// console.log("balle ", data.posballex, data.posballey)
			setData(data)
		});
		socket.on('aff_win', (data) => {
			finish = true
			setData(data)
		});
		socket.on('game_finish', () => {
			gamefinish()
		});
		socket.on('colpad', () => {
			playsound()
		});

		const onKeyPressed = (ev: KeyboardEvent): any => {
			if (ev.key === "ArrowDown") {
				socket.emit('OnKeyDownArrowDown')
			}
			else if (ev.key === "ArrowUp") {
				socket.emit('OnKeyDownArrowUp')
			}
		}

		window.addEventListener("keydown", onKeyPressed)


		return () => {
			if (socket) {
				socket.disconnect();
			}
		};
	}, []);
	const handleClick = () => {
		if (!canardmod) {
			canardmod = true
			console.log(canardmod)
		}
		else {
			canardmod = false
			console.log(canardmod)
		}
	};
	const playsound = () => {
		if (canardmod)
			new Audio(coin).play();
	};
	if (!data) {
		return (
			<React.Fragment>
				<Header />
				<div id="container">
					<Friends />
					<div className='image-center'>
						<h2> Matchmaking en cours .... </h2>
						<img src={ducky} alt='lol'>
						</img>
					</div>
				</div>
			</React.Fragment>

		)
	}
	else if (finish) {
		console.log(id)
		if (id === data["jdscockid"]) {
			if (data["scoredroite"] > data["scoregauche"]) {
				return (
					<React.Fragment>
						<Header />
						<div id="container">
							<Friends />
							<div className='image-center'>
								<h2> Victoire </h2>
								<img src={win} alt='lol'>
								</img>
							</div>
						</div>
					</React.Fragment>
				)
			}
			else {
				return (
					<React.Fragment>
						<Header />
						<div id="container">
							<Friends />
							<div className='image-center'>
								<h2> Defaite </h2>
								<img src={loose} alt='lol'>
								</img>
							</div>
						</div>
					</React.Fragment>
				)
			}
		}
		else if (id === data["jgscockid"]) {
			if (data["scoredroite"] < data["scoregauche"]) {
				return (
					<React.Fragment>
						<Header />
						<div id="container">
							<Friends />
							<div className='image-center'>
								<h2> Victoire </h2>
								<img src={win} alt='lol'>
								</img>
							</div>
						</div>
					</React.Fragment>
				)
			}
			else {
				return (
					<React.Fragment>
						<Header />
						<div id="container">
							<Friends />
							<div className='image-center'>
								<h2> Defaite </h2>
								<img src={loose} alt='lol'>
								</img>
							</div>
						</div>
					</React.Fragment>
				)
			}
		}

	}
	if (id === data["jdscockid"]) {
		return (
			<React.Fragment>
				<Header />
				<div id="container">
					<Friends />
					<div className='btn-game'>
						<button className="btn-size" onClick={handleClick}>{canardmod ? "Disable Canard mode" : "Enable Canard Mode"}</button>
					</div>
					<div className='image-center'>
						<h2>{data["scoregauche"]} --------- {data["scoredroite"]}</h2>
						<h2>Tu es a DROITE (bleu) ⬇️</h2>
						<Canvas data={data} canardmod={canardmod} />
					</div>
				</div>
			</React.Fragment>

		)
	}
	else {
		return (
			<React.Fragment>
				<Header />
				<div id="container">
					<Friends />
					<div className='btn-game'>
						<button className="btn-size" onClick={handleClick}>{canardmod ? "Disable Canard mode" : "Enable Canard Mode"}</button>
					</div>
					<div className='image-center'>
						<h2>{data["scoregauche"]} --------- {data["scoredroite"]}</h2>
						<h2>⬇️ Tu es a GAUCHE (rouge)</h2>
						<Canvas data={data} canardmod={canardmod} />
					</div>
				</div>
			</React.Fragment>

		)
	}
}

export default Game;