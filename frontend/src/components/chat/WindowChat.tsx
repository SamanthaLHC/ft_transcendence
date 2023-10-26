import React, { useState, useEffect, useRef } from 'react'
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
	const messageRef = useRef<HTMLDivElement | null>(null);

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

	useEffect(() => {
		if (messageRef.current) {
			messageRef.current.scrollTop = messageRef.current.scrollHeight;
		}
	}, [messages])

	const updateMessages = (channelName: string) => {
		console.log('I must update', channelName);

		const req = new Request("http://localhost:3000/chat/messages/" + channelName, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			},
		})
		fetch(req)
			.then((response) => response.json())
			.then((data) => {
				if (data.message) // if error
					return;
				const fetchedMessages = data.map((item: any) => {
					console.log("item: ", item)
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
				{socket.room}
			</div >
			<div className='messages-area' ref={element => (messageRef.current = element)}>	{/* the conv space */}
				<ul>
					{messages.map((message, index) => (
						<li key={index} className={index % 2 === 0 ? 'my-message typo-message' : 'other-message typo-message'}>
							<span>{message.msg}</span>
						</li>
					))}
				</ul>
			</div>
			<div id="input-area">
				<textarea id="inputMsg" name="inputMsg" value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleSendKey} />
				<button className="send-button" onClick={handleSendClick}> SEND </button>
			</div>
		</div>
	)
}

export default WindowChat;

//HERE set de faux users et un lorem ipsum pour voir le rendu du chan