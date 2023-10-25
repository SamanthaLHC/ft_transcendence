import React, { useEffect, useState } from 'react'
import ducky from '../../assets/duck-no.gif'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import MatchHistory from './MatchHistory'
import { Avatar, Divider, Typography } from '@mui/material'
import { useCookies } from 'react-cookie'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import WinsAndLoses from './WinsAndLoses'

const Profil: React.FC = () => {
	const [cookies] = useCookies(["access_token"]);
	const [userInfos, setUserInfos] = useState<{ name: string, photo: string } | null>(null);
	const [friend, setFriend] = useState<boolean>(false);
	const [block, setblock] = useState<boolean>(false);

	const navToHome = useNavigate();
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
		const checkme = async (id:string) => {
			try {
				let id_num:number = +id
				const req: Request = new Request('http://localhost:3000/users/me', {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
					},
				});

				const response = await fetch(req);
				const datas = await response.json();
				console.log(datas)
				if (datas.id == id_num) {
					changeToProfile()
				}
			}
			catch (error) {
				console.error(error);
			}
		}
		const initstatusfa = async (id: string) => {
			try {
				const req: Request = new Request('http://localhost:3000/users/status_relation?id=' + id, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
					},
				});

				const response = await fetch(req);
				const datas = await response.json();
				if (datas) {
					if (datas.status == "FRIEND") {
						setFriend(true)
						setblock(false)
					}
					else if (datas.status == "BLOCKED") {
						setFriend(false)
						setblock(true)
					}
					else
					{
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
		if (id)
		{
			checkme(id)
			initstatusfa(id);
		}
	}, [cookies.access_token, setFriend, setblock, getId]);

	const navToLogin: NavigateFunction = useNavigate();
	const changeToLogin = () => {
		let pathLogin: string = '/';
		navToLogin(pathLogin);
	}


	useEffect(() => {
		async function getUserInfo(id: string) {
			const req: Request = new Request('http://localhost:3000/users/id/' + id, {
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

	const addrelation = async (id:number, status: string) => {
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


	const handleClickfriend = () => {
		let id = getId()
		if (!id)
			return 
		let id_num:number = +id
		if (!friend)
		{
			addrelation(id_num, "FRIEND")
			setFriend(true)
			setblock(false)
		}
		else
		{
			setFriend(false)
			setblock(false)
			removerelation(id_num)
		}
	}

	const handleClickblock = () => {
		let id = getId()
		if (!id)
			return 
		let id_num:number = +id
		if (!block)
		{
			addrelation(id_num, "BLOCKED")
			setFriend(false)
			setblock(true)
		}
		else
		{
			setFriend(false)
			setblock(false)
			removerelation(id_num)
		}
	}

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='content-page'>
					<div className='list-items'>
						<div className='photo-pos'>
							<Avatar alt="profil picture" src={userInfos.photo} sx={{ width: 210, height: 210 }} />
						</div>
						<div className='typo-friends yellow'>
							{userInfos.name}
						</div>
						<div className='btn-pos'>
						<button className="btn-size" onClick={handleClickfriend}> {friend ? "Remove friend" : "add Friend"}</button>
						</div>
						<div className='btn-pos'>
						<button className="btn-size" onClick={handleClickblock}>{block ? "Unblock" : "block"}</button>
						</div>
						<div className='btn-pos'>
						<button className="btn-size" >Direct Message</button>
						</div>
						<div className='btn-pos'>
						<button className="btn-size" >Invite Game</button>
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

