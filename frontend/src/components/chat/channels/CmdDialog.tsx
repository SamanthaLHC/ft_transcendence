import React, { useState, useEffect } from 'react';
import { useChatSocket } from '../../Context';
import { useCookies } from 'react-cookie';
import { Navigate, useNavigate } from 'react-router-dom';
import MuteForm from './MuteForm';
import PwdForm from './PwdForm';
interface Channel {
	id: number;
	name: string;
	privacy: string;
}
interface CmdDialogProps {
	isOpen: boolean;
	channel: Channel;
	onClose: () => void;
}

const CmdDialog: React.FC<CmdDialogProps> = (props) => {
	const [inputValue, setInputValue] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [isMuteFormOpen, setIsMuteFormOpen] = useState(false);
	const [isPwdFormOpen, setPwdFormOpen] = useState(false);
	const [cookies] = useCookies(['access_token']);
	const socket = useChatSocket();
	const { isOpen, onClose } = props;
	const { channel } = props;

	const navToFriend = useNavigate();
	const changeToFriend = (id: number) => {
		let pathHome: string = '/friend?id=' + id;
		navToFriend(pathHome);
	}

	const handleClickProfile = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channel.id
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
			catch { alert("Not in channel") }
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
			else
				alert("Vous ne pouvez pas bloquer cette personne")
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
				ChannelId: channel.id
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
			catch { alert("Not in channel") }
		}
	}


	const navToChat = useNavigate();
	const changeToChat = (id: string) => {
		let pathChat: string = '/chat?mpid=' + id;
		console.log("PATH IN CHANGE TO CHAT :", pathChat);
		navToChat(pathChat);
		navToChat(0)
	}

	const handleClickGame = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channel.id
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
				if (datas.userId) {
					navToChat("/home")
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
			catch { alert("Not in channel") }
		}
	}

	const kick = async (channelid: number, targetId: number) => {
		const req: Request = new Request('http://localhost:3000/chat/channel/' + channel.id + '/kick/' + targetId, {
			method: "Post",
			headers: {
				"content-type": "application/json",
				"Authorization": `Bearer ${cookies.access_token}`,
			}
		});
		try {
			const response = await fetch(req);
			const datas = await response.json();
			if (datas.message) {
				alert("Error kicking: " + datas.message)
				return 0
			}
			return 1
		}
		catch { return 1 }
	}

	const ban = async (channelid: number, targetId: number) => {
		const req: Request = new Request('http://localhost:3000/chat/channel/' + channel.id + '/ban/' + targetId, {
			method: "Post",
			headers: {
				"content-type": "application/json",
				"Authorization": `Bearer ${cookies.access_token}`,
			}
		});
		try {
			const response = await fetch(req);
			const datas = await response.json();
			if (datas.message) {
				alert("Error banning: " + datas.message)
				return 0
			}
			return 1
		}
		catch { return 0 }
	}

	const unban = async (channelid: number, targetId: number) => {
		const req: Request = new Request('http://localhost:3000/chat/channel/' + channel.id + '/unban/' + targetId, {
			method: "Post",
			headers: {
				"content-type": "application/json",
				"Authorization": `Bearer ${cookies.access_token}`,
			}
		});
		try {
			const response = await fetch(req);
			const datas = await response.json();
			if (datas.message) {
				alert("Error unbanning: " + datas.message)
				return 0
			}
			return 1
		}
		catch { return 0 }
	}

	const handleClickkick = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channel.id
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
					if (await kick(channel.id, datas.userId)) {
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
			}
			catch { alert("Not in channel") }
		}
	}


	const handleClickMP = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channel.id
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
				if (datas.message) {
					alert("Error : " + datas.message)
				}
				else {
					changeToChat(datas.userId)
				}
			}
			catch { alert("Not in channel") }
		}
	}

	const handleClickban = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channel.id
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
					if (datas.status === "BANNED") {
						alert("Already banned")
					}
					else if (await ban(channel.id, datas.userId)) {
						const body = {
							msg: "Ban " + inputValue,
						};
						const req = new Request("http://localhost:3000/chat/new_message/" + socket.channel.id, {
							method: "POST",
							headers: {
								Authorization: `Bearer ${cookies.access_token}`,
								"Content-Type": "application/json",
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
						// }
					}
				}
			}
			catch { alert("Not in channel") }
		}
	}

	const handleClickunban = async () => {
		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				name: inputValue,
				ChannelId: channel.id
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
					if (datas.status !== "BANNED")
						alert("Not banned")
					else if (await unban(channel.id, datas.userId)) {
						const body = {
							msg: "UnBan " + inputValue,
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
				else
					alert("test")
			}
			catch { alert("Not banned") }
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
						if (datas.status == 'ADMIN') {
							setIsAdmin(true);
						}
						if (datas.status == 'OWNER') {
							setIsOwner(true);
						}
					}
				} catch (error) {
					console.error(error);
				}
			}
		}
		getStatus();
	}, [socket.channel.id, setIsAdmin, setIsOwner]);

	// __________________________________________________handle mute

	const handleMuteClick = () => {
		setIsMuteFormOpen(!isMuteFormOpen);
	};

	const handleSubmit = async (time: string) => {

		setIsMuteFormOpen(false);

		if (inputValue !== "\n" && inputValue !== "") {
			const obj = {
				targetName: inputValue,
				time: time
			};

			try {
				const req: Request = new Request(`http://localhost:3000/chat/channel/${channel.id}/mute`, {
					method: "POST",
					headers: {
						"content-type": "application/json",
						"Authorization": `Bearer ${cookies.access_token}`,
					},
					body: JSON.stringify(obj),
				});
				const response = await fetch(req);
				const datas = await response.json();
				if (datas.message)
					alert(datas.message);
				else
					alert(`${inputValue} Sucessfully muted for ${time} secondes`);

			} catch (error) {
				console.error(error);
			}
		}
	};

	// ____________________________________________handle password__________________

	const handleClickSetPwd = () => {
		setPwdFormOpen(!isPwdFormOpen);
	};

	const submitPwd = async (newPwd: string) => {

		setPwdFormOpen(false);

		const obj = {
			privacy: "PASSWORD_PROTECTED",
			password: newPwd
		};

		try {
			const req: Request = new Request(`http://localhost:3000/chat/channel/${channel.id}/edit`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(obj),
			});
			const response = await fetch(req);
			const datas = await response.json();
			if (datas.message)
				alert(datas.message);
			else
				alert(`Password succefully set`);

		} catch (error) {
			console.error(error);
		}
	}


	const handleClickUnsetPwd = async () => {

		const obj = {
			privacy: "PUBLIC"
		};

		try {
			const req: Request = new Request(`http://localhost:3000/chat/channel/${channel.id}/edit`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(obj),
			});
			const response = await fetch(req);
			const datas = await response.json();
			if (datas.message)
				alert(datas.message);
			else
				alert(`Password succefully unset`);

		} catch (error) {
			console.error(error);
		}
	}

	// ___________________________________________handle leave

	const handleClickLeave = async () => {
		try {
			const req: Request = new Request(`http://localhost:3000/chat/channel/leave/${channel.id}`, {
				method: "DELETE",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			});
			const response = await fetch(req);
			const datas = await response.json();
			if (datas) {
				if (datas.message)
					alert(datas.message);
				else {
					navToChat(0);
				}
			}

		} catch (error) {
			console.error(error);
		}

	}

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
					maxLength={15}
					placeholder="User name"
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<div>
					{isOwner && (
						<div className="form-owner-section">
							<button className="btn-dialog" onClick={handleClickAdmin}>Set as admin</button>
							<button className="btn-dialog" onClick={handleClickUnsetAdmin}>Unset as admin</button>
							<button className="chan-action-btn" onClick={handleClickSetPwd}> set password</button>
							{isPwdFormOpen && (
								<PwdForm isOpen={isPwdFormOpen} onSubmit={submitPwd} />
							)}
							<button className="chan-action-btn" onClick={handleClickUnsetPwd}> unset password</button>
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
							<button className="btn-dialog" onClick={handleClickunban}>Unban</button>
							<button className="btn-dialog" onClick={handleClickkick}>Kick</button>
							<button className="btn-dialog" onClick={handleMuteClick}>Mute</button>
							{isMuteFormOpen && (
								<MuteForm isOpen={isMuteFormOpen} onSubmit={handleSubmit} />
							)}
						</div>
					)}
					<div className="form-regular-user-section">
						{(channel.privacy !== "PRIVATE") &&
							<button className="chan-action-btn" onClick={handleClickLeave}>Leave chan</button>
						}
					</div>
				</div>
			</div>
		</dialog >
	);
};

export default CmdDialog;