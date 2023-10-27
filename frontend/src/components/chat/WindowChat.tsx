import React, { useState, useEffect, useRef } from 'react'
import { useChatSocket } from '../Context';
import { useCookies } from "react-cookie";
import { useUser } from "../Context";

interface Message {
	sender: string
	msg: string
}

const WindowChat: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const socket = useChatSocket()
	const [inputValue, setInputValue] = useState('');
	const [cookies] = useCookies(["access_token"]);
	const messageRef = useRef<HTMLDivElement | null>(null);
	const { userData } = useUser();

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

		socket.socket.on('update_front', () => {
			updateMessages();
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

	const updateMessages = () => {
		console.log('I must update', socket.channel.name, '(ID:', socket.channel.id, ')');

		const req = new Request("http://localhost:3000/chat/messages/" + socket.channel.id, {
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
					const tmp = {
						sender: item.sender.name,
						msg: item.content,
					}
					return tmp;
				});
				setMessages(fetchedMessages);
				console.log("messages :", messages)
			})
			.catch((error) => {
				console.error("Error updating channel " + socket.channel.name + ":", error);
			});
	}

	const handleSendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (inputValue !== "\n" && inputValue !== "" && socket.channel.name !== "") {
			emitMsg()
		} else {
			setInputValue("")
		}
	}

	const handleSendKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter') {
			if (inputValue !== "\n" && inputValue !== "" && socket.channel.name !== "") {
				emitMsg();
			} else {
				setInputValue("")
			}
		}
	}

	const emitMsg = () => {
		if (socket.channel.name !== "") {
			const body = {
				msg: inputValue,
			};
			const req = new Request("http://localhost:3000/chat/new_message/" + socket.channel.id, {
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
					if (data.message) {
						alert("Error sending message: " + data.message)
					} else {
						socket.socket.emit('update', inputValue)
					}
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
				{ socket.channel.name }
			</div >
			<div className='messages-area' ref={element => (messageRef.current = element)}>	{/* the conv space */}
				<ul>
					{messages.map((message, index) => (
						<li key={index} className={ message.sender === userData.name ? 'my-message typo-message' : 'other-message typo-message'}>
							<span><b>{message.sender + ":"}</b><br></br>{message.msg}</span>
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