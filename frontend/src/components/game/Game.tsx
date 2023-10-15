import React, { useEffect, useState } from 'react'
import ducky from '../../assets/fire.gif'
// import coin from '../../assets/canard.mp3'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import io from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Canvas from './Canvas'

const Game:React.FC = () => {
	const [cookies] = useCookies(["access_token"]);
	const navToHome = useNavigate();
	const [canardmod, setCanardmod] = useState<boolean>(false);
	const gamefinish = () => {
			let pathHome: string = '/home';
			navToHome(pathHome);
	}
	const [data, setData] = useState(null);
	const playsound = () => {
		new Audio("e").play();
	}
	useEffect(() => {
		const socket = io('http://localhost:3000', {
			autoConnect: false,
		  });
		let token = cookies.access_token;
		socket.auth = { token };
		socket.connect()
		// setSocket(socketInstance);
	  
		// listen for events emitted by the server
	  
		socket.on('connect', () => {
		  console.log('Connected to server');
		});
	  
		socket.on('connect_room', (data) => {
			console.log(`Received conect room: ${data}`);
			setData(data)
		  });
		socket.on('update', (data) => {
			// console.log("balle ", data.posballex, data.posballey)
		  setData(data)
		});
		socket.on('game_finish', () => {
			gamefinish()
		});
		socket.on('colpad', () => {
			// playsound()
		});

		const onKeyPressed = (ev: KeyboardEvent): any => {
			if (ev.key === "ArrowDown")
			{
				socket.emit('OnKeyDownArrowDown')
			}
			else if (ev.key === "ArrowUp")
			{
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
		if (!canardmod)
			setCanardmod(true)
		else
			setCanardmod(false)
	};
	if (!data)
	{
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
	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='image-center'>
					<button className="btn-size" onClick={handleClick}>{canardmod ? "Disable Canard mode" : "Enable Canard Mode"}</button>
					<h2> {data["scoregauche"]} --------- {data["scoredroite"]}</h2>
					<Canvas data={data} canardmod={canardmod}/>
				</div>
			</div>
		</React.Fragment>

	)
}

export default Game;