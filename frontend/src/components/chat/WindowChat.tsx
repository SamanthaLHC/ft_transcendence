import React, { useState, useEffect } from 'react'
import { useChatSocket } from '../Context';
import { useCookies } from "react-cookie";

const WindowChat: React.FC = () => {

	const socket = useChatSocket()
	const [inputValue, setInputValue] = useState('');
	const [cookies] = useCookies(["access_token"]);

	//Socket
	useEffect(() => {
		// , {
		// 	autoConnect: false,
		//   });
		socket.socket.connect()
		// setSocket(socketInstance);
	  
		// listen for events emitted by the server
	  
		socket.socket.on('connect', () => {
		  console.log('Chat connected to server');
		});

		socket.socket.on('update_front', (channelName) => {
			console.log('I must update', channelName);
			const body = {
				channel: channelName,
			};
			console.log(body)

			const req = new Request("http://localhost:3000/chat/channel/update/", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
					"Content-Type": "application/json", // Specify content type
				},
				body: JSON.stringify(body),
			})
			fetch(req)
				.then((response) => {console.log(response);response.json()})
				.then((data) => {
					console.log(data)
				})
				.catch((error) => {
					console.error("Error updating channel " + channelName + ":", error);
				});

		}); 

		// socket.socket.on('channel', (data) => {
		// 	setChannelName(data)
		// 	console.log('update channel', channelName);
		// }); 

		return () => {
		  if (socket) {
			socket.socket.disconnect();
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
		if (socket.room !== "") {
			const body = {
				msg: inputValue,
				channel: socket.room,
			};
			console.log(body)
			const req = new Request("http://localhost:3000/chat/channel/msg/" + socket.room, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
					"Content-Type": "application/json", // Specify content type
				},
				body: JSON.stringify(body),
			})
			fetch(req)
				.then((response) => {console.log(response);response.json()})
				.then((data) => {
					socket.socket.emit('update', inputValue)
				})
				.catch((error) => {
					console.error("Error sending message:", error);
				});
	
		}
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