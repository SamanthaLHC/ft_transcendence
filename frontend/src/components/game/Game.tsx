import React, { useEffect, useState } from 'react'
import ducky from '../../assets/fire.gif'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import io from 'socket.io-client';
import { useCookies } from 'react-cookie';

const Game:React.FC = () => {
	const [cookies] = useCookies(["access_token"]);
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
		  });
		socket.on('update', (data) => {
		  console.log(`Received update:`, data);
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
	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='image-center'>
					<h2> /!\ -- GAME -- UNDER CONSTRUCTION /!\ </h2>
					<img src={ducky} alt='lol'>
					</img>
				</div>
			</div>
		</React.Fragment>

	)
}

export default Game;