import React, { useState, useEffect } from 'react'
import { useChatSocket } from '../Context';
import { useCookies } from "react-cookie";
import { ListItem, Divider, ListItemText } from '@mui/material';
import { channel } from 'diagnostics_channel';

interface Message {
	msg: string
}

const WindowChat: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);

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
			updateMessages(channelName);
		}); 

		return () => {
		  if (socket) {
			socket.socket.disconnect();
		  }
		};
	  }, []);

	const updateMessages = (channelName: string) => {
		console.log('I must update', channelName);
		const body = {
			channel: channelName,
		};

		const req = new Request("http://localhost:3000/chat/channel/update/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
				"Content-Type": "application/json", // Specify content type
			},
			body: JSON.stringify(body),
		})
		fetch(req)
			.then((response) => response.json())
			.then((data) => {
				const fetchedMessages = data.map((item: any) => {
					const tmp = item.sender.name + ": " + item.content
					return { msg: tmp };
				});
				setMessages(fetchedMessages);
			})
			.catch((error) => {
				console.error("Error updating channel " + channelName + ":", error);
			});
	}

	const handleSendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (inputValue !== "\n" && inputValue !== "" && socket.room !== "") {
			emitMsg()
		} else {
			setInputValue("")
		}
	}
	
	const handleSendKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter') {
			if (inputValue !== "\n" && inputValue !== "" && socket.room !== "") {
				emitMsg();
			} else {
				setInputValue("")
			}
		}
	}

	const emitMsg = () => {
		if (socket.room !== "") {
			const body = {
				msg: inputValue,
				channel: socket.room,
			};
			const req = new Request("http://localhost:3000/chat/channel/msg/" + socket.room, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
					"Content-Type": "application/json", // Specify content type
				},
				body: JSON.stringify(body),
			})
			fetch(req)
				.then((response) => response.json())
				.then((data) => {
					socket.socket.emit('update', inputValue)
				})
				.catch((error) => {
					console.error("Error sending message:", error);
				});
	
		}
		setInputValue("")
	}

	return (
		<div className='chat-content'> {/* the big window */}
			<div className='chat-header'> {/* en tete avec tite du chan */}
				{ socket.room }
			</div>
			<div className='messages-area'>	{/* the conv space */}
				<ul>
				{messages.map((message, index) => (
							<ListItem className="yellow" key={index} >
									<Divider>
										<ListItemText />
										{message.msg}
									</Divider>
							</ListItem>
						))}
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