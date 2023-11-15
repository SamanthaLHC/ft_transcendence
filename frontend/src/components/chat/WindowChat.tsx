import React, { useState, useEffect, useRef } from 'react'
import { useChatSocket } from '../Context';
import { useCookies } from "react-cookie";
import { useUser } from "../Context";
import CmdDialog from './channels/CmdDialog';
import MessageChat from './MessageChat';
import { useNavigate } from 'react-router-dom';

interface Message {
	id: number
	sender: string
	senderId: number
	msg: string
	type: string
}

const WindowChat: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const socket = useChatSocket()
	const [inputValue, setInputValue] = useState('');
	const [cookies] = useCookies(["access_token"]);
	const messageRef = useRef<HTMLDivElement | null>(null);
	const { userData } = useUser();
	const [displayName, setDisplayName] = useState("");
	const [isCmdDialogOpen, setCmdDialogOpen] = useState(false);


	//Socket

	const navTo = useNavigate();
	const changetogamefriend = (id:string) => {
		navTo("/gamefriend?id=" + id)
	}
	const actualiser = () => {
		navTo(0)
	}
	useEffect(() => {
		// , {
		// 	autoConnect: false,
		//   });
		let token = cookies.access_token;
		socket.socket.auth = { token };
		socket.socket.connect()
		// setSocket(socketInstance);

		// listen for events emitted by the server

		socket.socket.on('connect', () => {
			console.log('Chat connected to server');
		});

		socket.socket.on('accgame', (data) => {
			changetogamefriend(data)
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
				{
					actualiser()
				}
				const fetchedMessages = data.map((item: any) => {
					const tmp:Message = {
						id:	item.id,
						sender: item.sender.name,
						senderId: item.sender.id,
						msg: item.content,
						type: item.type,
					}
					return tmp;
				});
				setMessages(fetchedMessages);
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
	useEffect(() => {

		const getnamedm = async (id: number) => {
			const req = new Request("http://localhost:3000/chat/channel/private/getname/" + id, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			});

			await fetch(req)
				.then((response) => response.json())
				.then((data) => {
					if (data) { // if error
						setDisplayName("[DM] " + data.name);
						// socket.channel.name = "[DM] " + data.name
					}
				})
				.catch((error) => {
					console.error("Error fetching channels:", error);
				});
		};
		const fetchData = async () => {
			if (socket.channel.privacy === "PRIVATE") {
				await getnamedm(socket.channel.id);
			}
			else
				setDisplayName("");
		};

		fetchData();
	}, [socket.channel]);

	//_____________________________________handle cmd form for / button

	const openCmdDialog = () => {
		setCmdDialogOpen(true);
	}

	const closeCmdDialog = () => {
		setCmdDialogOpen(false);
	}

	return (
		<div className='chat-content'> {/* the big window */}
			<div className='chat-header'> {/* en tete avec tite du chan */}
				{displayName || socket.channel.name}
			</div >
			<div className='messages-area' ref={element => (messageRef.current = element)}>	{/* the conv space */}
				<ul>
					{messages.map((message, index) => (
						<li key={index} className={ message.sender === userData.name ? 'my-message typo-message' : 'other-message typo-message'}>
							<MessageChat message={message}/>
						</li>
					))}
				</ul>
			</div>
			<div id="input-area">
				<textarea id="inputMsg" name="inputMsg" value={inputValue} maxLength={5000}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleSendKey} />
				<button className="send-button" onClick={handleSendClick}> SEND </button>
				<button className="send-button" onClick={openCmdDialog}> / </button>
				< CmdDialog isOpen={isCmdDialogOpen} channelId={socket.channel.id} onClose={closeCmdDialog} />

			</div>
		</div>
	)
}

export default WindowChat;
