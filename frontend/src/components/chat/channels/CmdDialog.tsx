import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

interface CmdDialogProps {
	isOpen: boolean;
	channelId: number;
	onClose: () => void;
}

const CmdDialog: React.FC<CmdDialogProps> = (props) => {
	const [inputValue, setInputValue] = useState('');
	const [cookies] = useCookies(['access_token']);
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
					<div className="form-owner-section">
						<button className="btn-dialog">Set as admin</button>
					</div>
					<div className="form-regular-user-section">
						<button className="btn-dialog" onClick={handleClickGame}>Invite to play</button>
						<button className="btn-dialog" onClick={handleClickProfile}>See profile page</button>
						<button className="btn-dialog" onClick={handleClickMP}>Private message</button>
						<button className="btn-dialog" onClick={handleClickblock}>Block</button>
					</div>
					<div className="form-admin-section">
						<button className="btn-dialog">Ban</button>
						<button className="btn-dialog">Kick</button>
						<button className="btn-dialog">Mute</button>
					</div>
				</div>
			</div>
		</dialog>
	);
};

export default CmdDialog;
