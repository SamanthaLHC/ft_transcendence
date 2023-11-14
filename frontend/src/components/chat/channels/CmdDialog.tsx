import React, { useState, useEffect } from 'react';
import { useChatSocket } from '../../Context';
import { useCookies } from 'react-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

interface CmdDialogProps {
	isOpen: boolean;
	channelId: number;
	onClose: () => void;
}

const CmdDialog: React.FC<CmdDialogProps> = (props) => {
	const [inputValue, setInputValue] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [cookies] = useCookies(['access_token']);
	const socket = useChatSocket()
	const { isOpen, onClose } = props;
	const { channelId } = props;

	const navToFriend = useNavigate();
	const changeToFriend = (id: number) => {
		let pathHome: string = '/friend?id=' + id;
		navToFriend(pathHome);
	}

	const handleClickProfile = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channelId
			};
			const req: Request = new Request('http://localhost:3000/chat/getUserIdbyname', {
				method: "Post",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(obj),
			});
			try {
				const response = await fetch(req);
				const datas = await response.json();
				if (datas) {
					changeToFriend(datas.userId)
				}
			}
			catch { }
		}
	}

	const addrelation = async (id: number, status: string) => {
		const obj = {
			target_id: id,
			status: status
		};
		const req: Request = new Request('http://localhost:3000/users/addup_relation', {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"Authorization": `Bearer ${cookies.access_token}`,
			},
			body: JSON.stringify(obj),
		});

		try {
			const response = await fetch(req);
			if (response.ok) {
				alert("Succes");
			}
		} catch (error) {
			console.error(error);
		}
	}

	const removerelation = async (id: number) => {
		const obj = {
			target_id: id,
		};
		const req: Request = new Request('http://localhost:3000/users/rm_relation', {
			method: "DELETE",
			headers: {
				"content-type": "application/json",
				"Authorization": `Bearer ${cookies.access_token}`,
			},
			body: JSON.stringify(obj),
		});

		try {
			const response = await fetch(req);
			if (response.ok) {
				alert("Succes");
			}
		} catch (error) {
			console.error(error);
		}
	}

	const handleClickblock = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channelId
			};
			const req: Request = new Request('http://localhost:3000/chat/getUserIdbyname', {
				method: "Post",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(obj),
			});
			try {
				const response = await fetch(req);
				const datas = await response.json();
				if (datas) {
					addrelation(datas.userId, "BLOCKED")
				}
			}
			catch { }
		}
	}


	const navToChat = useNavigate();
	const changeToChat = (id: string) => {
		let pathChat: string = '/chat?mpid=' + id;
		navToChat(pathChat);
		navToChat(0)
	}

	const handleClickGame = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channelId
			};
			const req: Request = new Request('http://localhost:3000/chat/getUserIdbyname', {
				method: "Post",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(obj),
			});
			try {
				navToChat("/home")
				const response = await fetch(req);
				const datas = await response.json();
				if (datas) {
					const req = new Request("http://localhost:3000/chat/channel/private/game/" + datas.userId, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${cookies.access_token}`,
						},
					});

					fetch(req)
						.then((response) => response.json())
						.then((data) => {
							if (data) {
								if (datas)
									changeToChat(datas.userId);
							}
						})
						.catch((error) => {
							console.error("Error fetching channels:", error);
						});
				}
			}
			catch { }
		}
	}

	const kick = async (channelid: number, targetId: number) => {
		const req: Request = new Request('http://localhost:3000/chat/channel/' + channelid + '/kick/' + targetId, {
			method: "Post",
			headers: {
				"content-type": "application/json",
				"Authorization": `Bearer ${cookies.access_token}`,
			}
		});
		try {
			const response = await fetch(req);
			const datas = await response.json();
		}
		catch { }
	}

	const ban = async (channelid: number, targetId: number) => {
		const req: Request = new Request('http://localhost:3000/chat/channel/' + channelid + '/ban/' + targetId, {
			method: "Post",
			headers: {
				"content-type": "application/json",
				"Authorization": `Bearer ${cookies.access_token}`,
			}
		});
		try {
			const response = await fetch(req);
			const datas = await response.json();
		}
		catch { }
	}

	const handleClickkick = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channelId
			};
			const req: Request = new Request('http://localhost:3000/chat/getUserIdbyname', {
				method: "Post",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(obj),
			});
			try {
				const response = await fetch(req);
				const datas = await response.json();
				if (datas) {
					kick(channelId, datas.userId)
					const body = {
						msg: "Kick " + inputValue,
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
			}
			catch { }
		}
	}


	const handleClickMP = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channelId
			};
			const req: Request = new Request('http://localhost:3000/chat/getUserIdbyname', {
				method: "Post",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(obj),
			});
			try {
				const response = await fetch(req);
				const datas = await response.json();
				if (datas) {
					changeToChat(datas.userId)
				}
			}
			catch { }
		}
	}

	const handleClickban = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channelId
			};
			const req: Request = new Request('http://localhost:3000/chat/getUserIdbyname', {
				method: "Post",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(obj),
			});
			try {
				const response = await fetch(req);
				const datas = await response.json();
				if (datas) {
					ban(channelId, datas.userId)
					const body = {
						msg: "Ban " + inputValue,
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
			}
			catch { }
		}
	}

	const handleClickAdmin = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const body = {
				name: inputValue,
			};
			const req: Request = new Request('http://localhost:3000/chat/channel/' + socket.channel.id + '/setAdmin', {
				method: "Post",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(body),
			});
			fetch(req)
				.then((response) => response.json())
				.then((data) => {
					if (data.message && data.message !== "Blank username") {
						alert(data.message);
					}
					else if (data.message !== "Blank username") {
						const body = {
							msg: inputValue + " is now admin of this channel",
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

				})
				.catch((error) => {
					console.error("Error fetching channels:", error);
				});
		}

	}


	const handleClickUnsetAdmin = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const body = {
				name: inputValue,
			};
			const req: Request = new Request('http://localhost:3000/chat/channel/' + socket.channel.id + '/unsetAdmin', {
				method: "Post",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(body),
			});
			fetch(req)
				.then((response) => response.json())
				.then((data) => {
					if (data.message && data.message !== "Blank username") {
						alert(data.message);
					}
					else if (data.message !== "Blank username") {
						const body = {
							msg: inputValue + " is no more an admin of this channel (Cheh !)",
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

				})
				.catch((error) => {
					console.error("Error fetching channels:", error);
				});
		}

	}



	//__________________________________________________get user role_______

	useEffect(() => {

		async function getStatus() {
			setIsAdmin(false);
			setIsOwner(false);

			if (socket.channel.id != -1) {

				const req: Request = new Request('http://localhost:3000/chat/channel/' + socket.channel.id + '/status', {
					method: "GET",
					headers: {
						"content-type": "application/json",
						"Authorization": `Bearer ${cookies.access_token}`,
					},
				});

				try {
					const response = await fetch(req);
					const datas = await response.json();

					if (response.ok) {
						if (datas.status == 'ADMIN')
							setIsAdmin(true);
						if (datas.status == 'OWNER')
							setIsOwner(true);
					}
				} catch (error) {
					console.error(error);
				}
			}
		}
		getStatus();
	}, [socket.channel.id, setIsAdmin, setIsOwner]);

	// __________________________________________________handle mute



	if (!isOpen) {
		return null;
	}

	return (
		<dialog className="dialog">
			<div className='dialog-header'>
				<div className="dialog-title azonix yellow ">Who?</div>
				<div className='close-btn-pos '>
					<button className='close-btn' onClick={onClose}>x</button>
				</div>
			</div>
			<div className="dialog-content">
				<input
					className='input-pos'
					type="text"
					placeholder="User login"
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<div>
					{isOwner && (
						<div className="form-owner-section">
							<button className="btn-dialog" onClick={handleClickAdmin}>Set as admin</button>
						</div>
					)}
					<div className="form-regular-user-section">
						<button className="btn-dialog" onClick={handleClickGame}>Invite to play</button>
						<button className="btn-dialog" onClick={handleClickProfile}>See profile page</button>
						<button className="btn-dialog" onClick={handleClickMP}>Private message</button>
						<button className="btn-dialog" onClick={handleClickblock}>Block</button>
					</div>
					{(isAdmin || isOwner) && (
						<div className="form-admin-section">
							<button className="btn-dialog" onClick={handleClickban}>Ban</button>
							<button className="btn-dialog" onClick={handleClickkick}>Kick</button>
							<button className="btn-dialog">Mute</button>
							{/* {isTimeDialogOpen &&} */}
						</div>
					)}
				</div>
			</div>
		</dialog>
	);
};

export default CmdDialog;
