import React, { useEffect, useState } from 'react'
import ducky from '../../assets/fire.gif'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import io from 'socket.io-client';

const Game:React.FC = () => {
	// const [socket, setSocket] = useState(null);
	useEffect(() => {
		const socket = io('http://localhost:3000', {
			autoConnect: false,
		  });
		// let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZGRhOWM0YjZhYTlkMjQ5ZDZhMTQ1MzJlZWEyNDY0NzYiLCJ0eXBlIjoiYWNjZXMiLCJzdWIiOjEsInVzZXJuYW1lIjoibmZlbHNlbWIiLCJpYXQiOjE2OTY2MDAyNDksImV4cCI6MTY5NjY4NjY0OX0.iXSh4HBpHtGaBOLhJBCHK5NjJMih3LUIPtnG5Ld-RaE";
		// socket.auth = { token };
		socket.connect()
		// setSocket(socketInstance);
	  
		// listen for events emitted by the server
	  
		socket.on('connect', () => {
		  console.log('Connected to server');
		});
	  
		socket.on('lalalalala', (data) => {
		  console.log(`Received message: ${data}`);
		});

		socket.emit('message', "un lapin")
	  
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