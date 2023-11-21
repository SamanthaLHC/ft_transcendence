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
import Canvas from './CanvasF'

let canardmod = false
let finish = false
let id = ""

const GameF: React.FC = () => {
	const [cookies] = useCookies(["access_token"]);
	const navToHome = useNavigate();
	const gamefinish = () => {
		let pathHome: string = '/home';
		finish = false
		id = ""
		navToHome(pathHome);
	}
	const [data, setData] = useState(null);

	function getId(): string | null {
		let url_str: string = window.location.search;
		let strToSearch: URLSearchParams = new URLSearchParams(url_str);
		let code_param: string | null = strToSearch.get("id");
		if (!code_param)
			gamefinish()
		return code_param;
	}

	useEffect(() => {

		const socket = io('http://localhost:3000/fgame', {
			autoConnect: false,
		});
		let token = cookies.access_token;
		socket.auth = { token };
		socket.connect()
		// setSocket(socketInstance);

		// listen for events emitted by the server

		socket.on('connect', () => {
			console.log('Connected to server friend ', getId());
			socket.emit('conection', getId())
			id = socket.id
		});

		socket.on('connect_room', (data) => {
			setData(data)
		});
		socket.on('update', (data) => {
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
				socket.off('connect')
				socket.off('connect_room')
				socket.off('update')
				socket.off('aff_win')
				socket.off('game_finish')
				socket.off('colpad')
				socket.disconnect();
			}
		};
	}, []);
	const handleClick = () => {
		if (!canardmod) {
			canardmod = true
		}
		else {
			canardmod = false
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
					<div className='content-profile'>
						<div className='first-row'>

							<div className='btn-game'>
								<button className="btn-size" onClick={handleClick}>{canardmod ? "Disable Canard mode" : "Enable Canard Mode"}</button>
							</div>
							<h2 className='typo-friends yellow'>{data["scoregauche"]} --------- {data["scoredroite"]}</h2>
							<h2 className='typo-friends yellow'>Tu es a DROITE (bleu) ⬇️</h2>
						</div>
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
					<div className='content-profile'>
						<div className='first-row'>
							<div className='btn-game'>
								<button className="btn-size" onClick={handleClick}>{canardmod ? "Disable Canard mode" : "Enable Canard Mode"}</button>
							</div>
							<h2 className='typo-friends yellow'>{data["scoregauche"]} --------- {data["scoredroite"]}</h2>
							<h2 className='typo-friends yellow'>⬇️ Tu es a GAUCHE (rouge)</h2>
						</div>
						<Canvas data={data} canardmod={canardmod} />
					</div>
				</div>
			</React.Fragment>

		)
	}
}

export default GameF;