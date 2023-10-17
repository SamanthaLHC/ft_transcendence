import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { useChatSocket } from '../Context';

const WindowChat: React.FC = () => {

	//Socket
	const socket = useChatSocket()
	useEffect(() => {
		// , {
		// 	autoConnect: false,
		//   });
		socket.connect()
		// setSocket(socketInstance);
	  
		// listen for events emitted by the server
	  
		socket.on('connect', () => {
		  console.log('Chat connected to server');
		});

		socket.on('update_front', () => {
			console.log('I must update');
		}); 
 
		return () => {
		  if (socket) {
			socket.disconnect();
		  }
		};
	  }, []);

	const handleSendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		// fetch pour envoyer le message en base de donnée
		socket.emit('update', "update")
	}

	return (
		<div className='chat-content'> {/* the big window */}
			<div className='chat-header'> {/* en tete avec tite du chan */}
				Chan name (wip)
			</div>
			<div className='messages-area'>	{/* the conv space */}
				<ul>
					{/* here, the messages sent */}
				</ul>
			</div>
			<div id="input-area">
				<textarea />
				<button className="send-button" onClick={handleSendClick}> SEND </button>
			</div>
		</div>
	)
}

export default WindowChat;

//HERE set de faux users et un lorem ipsum pour voir le rendu du chan