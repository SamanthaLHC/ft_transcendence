import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { useChatSocket } from '../Context';

const WindowChat: React.FC = () => {

	const socket = useChatSocket()
	const [inputValue, setInputValue] = useState('');

	//Socket
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

		socket.on('update_front', (data) => {
			console.log('I must update', data);
		}); 
 
		return () => {
		  if (socket) {
			socket.disconnect();
		  }
		};
	  }, []);

	const handleSendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (inputValue !== "") {
			emitMsg()
		}
	}
	const handleSendKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && inputValue != "") {
			emitMsg();
		}
	}

	const emitMsg = () => {
		socket.emit('update', inputValue)
		console.log("in handle")
		setInputValue("")
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
				<textarea id="inputMsg" name="inputMsg" value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={handleSendKey}/>
				<button className="send-button" onClick={handleSendClick}> SEND </button>
			</div>
		</div>
	)
}

export default WindowChat;

//HERE set de faux users et un lorem ipsum pour voir le rendu du chan