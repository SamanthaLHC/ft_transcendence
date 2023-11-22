/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import MatchHistory from './MatchHistory'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import WinsAndLoses from './WinsAndLoses'
import Statusconnect from './Statusconnect'
import { useChatSocket } from '../Context';

const Profil: React.FC = () => {
	const [cookies] = useCookies(["access_token"]);
	const [userInfos, setUserInfos] = useState<{ name: string, photo: string, status: string } | null>(null);
	const [friend, setFriend] = useState<boolean>(false);
	const [block, setblock] = useState<boolean>(false);
	const socket = useChatSocket();

	const navToHome = useNavigate();
	const navToChat = useNavigate();
	const changeToHome = () => {
		let pathHome: string = '/Home';
		navToHome(pathHome);
	}

	const changeToProfile = () => {
		let pathHome: string = '/profil';
		navToHome(pathHome);
	}

	function getId(): string | null {
		let url_str: string = window.location.search;
		let strToSearch: URLSearchParams = new URLSearchParams(url_str);
		let code_param: string | null = strToSearch.get("id");
		if (!code_param)
			changeToHome()
		return code_param;
	}

	useEffect(() => {
		const checkme = async (id: string) => {
			try {
				let id_num: number = +id
				const req: Request = new Request('http://' + process.env.REACT_APP_HOSTNAME + ':3000/users/me', {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
					},
				});

				const response = await fetch(req);
				const datas = await response.json();
				if (datas.id === id_num) {
					changeToProfile()
				}
			}
			catch (error) {
				console.error(error);
			}
		}
		const initstatusfa = async (id: string) => {
			try {
				const req: Request = new Request('http://' + process.env.REACT_APP_HOSTNAME + ':3000/users/status_relation?id=' + id, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
					},
				});

				const response = await fetch(req);
				const datas = await response.json();
				if (datas) {
					if (datas.status === "FRIEND") {
						setFriend(true)
						setblock(false)
					}
					else if (datas.status === "BLOCKED") {
						setFriend(false)
						setblock(true)
					}
					else {
						setFriend(false)
						setblock(false)
					}
				}
			}
			catch (error) {
				console.error(error);
			}
		};
		let id = getId()
		if (id) {
			checkme(id)
			initstatusfa(id);
		}
	}, [cookies.access_token, setFriend, setblock, navToHome]);


	useEffect(() => {
		async function getUserInfo(id: string) {
			const req: Request = new Request('http://' + process.env.REACT_APP_HOSTNAME + ':3000/users/id/' + id, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			});

			const response = await fetch(req);
			const datas = await response.json();
			if (response.status === 200 || response.status === 304) {
				setUserInfos(datas);
			}
			else {
				changeToHome();
			}
		}
		let id = getId()
		if (id)
			getUserInfo(id);
	}, [cookies.access_token]);
	if (!userInfos) {
		return null
	}

	const addrelation = async (id: number, status: string) => {
		const obj = {
			target_id: id,
			status: status
		};
		const req: Request = new Request('http://' + process.env.REACT_APP_HOSTNAME + ':3000/users/addup_relation', {
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
		const req: Request = new Request('http://' + process.env.REACT_APP_HOSTNAME + ':3000/users/rm_relation', {
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


	const handleClickfriend = () => {
		let id = getId()
		if (!id)
			return
		let id_num: number = +id
		if (!friend) {
			addrelation(id_num, "FRIEND")
			setFriend(true)
			setblock(false)
		}
		else {
			setFriend(false)
			setblock(false)
			removerelation(id_num)
		}
	}

	const handleClickblock = () => {
		let id = getId()
		if (!id)
			return
		let id_num: number = +id
		if (!block) {
			addrelation(id_num, "BLOCKED")
			setFriend(false)
			setblock(true)
		}
		else {
			setFriend(false)
			setblock(false)
			removerelation(id_num)
		}
	}

	const changeToChat = (id: string) => {
		let pathChat: string = '/chat?mpid=' + id;
		navToChat(pathChat);
	}

	const handleClickMP = () => {
		const id = getId()
		if (id)
			changeToChat(id)
	}

	const handleClickGame = () => {
		const id = getId()
		if (!id)
			changeToHome()
		const req = new Request("http://" + process.env.REACT_APP_HOSTNAME + ":3000/chat/channel/private/game/" + id, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			},
		});

		fetch(req)
			.then((response) => response.json())
			.then((data) => {
				if (data) {
					if (id)
						changeToChat(id);
						socket.socket.emit('update_otherchan', data.channelId)
				}
			})
			.catch((error) => {
				console.error("Error fetching channels:", error);
			});
	}

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='content-page'>
					<div className='list-items'>
						<div className='photo-pos'>
							<Statusconnect photo={userInfos.photo} status={userInfos.status} />

						</div>
						<div className='typo-friends yellow'>
							{userInfos.name}
						</div>
						<div className='btn-friend-page'>
							<button className="btn-size" onClick={handleClickfriend}> {friend ? "Remove friend" : "add Friend"}</button>
						</div>
						<div className='btn-friend-page'>
							<button className="btn-size" onClick={handleClickblock}>{block ? "Unblock" : "block"}</button>
						</div>
						<div className='btn-friend-page'>
							<button className="btn-size" onClick={handleClickMP}>Direct Message</button>
						</div>
						<div className='btn-friend-page'>
							<button className="btn-size" onClick={handleClickGame}>Invite Game</button>
						</div>
					</div>
					<div className='list-items'>
						<div className='second-row'>
							<div className='section-items'>
								<MatchHistory />
								<WinsAndLoses />
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}
export default Profil;

