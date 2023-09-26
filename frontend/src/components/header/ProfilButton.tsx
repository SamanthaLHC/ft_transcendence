import React from "react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Divider, Typography } from '@mui/material';
import { Link , useNavigate } from "react-router-dom";


const options = [
	{
		title: "view my profil",
		url: "/profil",
	},
	{
		title: "settings",
		url: "/settings",
	},
	{
		title: "logout",
		// url: "/profil",
	},
];

export default function ProfilButton() {

	let navToProfil = useNavigate();
	const changeToProfil = () => {
		let pathProfil = '/profil';
		navToProfil(pathProfil);
	}


	let navToLogin = useNavigate();
	const changeToLogin = () => {
		let pathLogin = '/';
		navToLogin(pathLogin);
	}

	const [cookies] = useCookies(["access_token"]);
	const [userInfos, setUserInfos] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		async function getUserInfo() {
			const req = new Request('http://localhost:3000/users/me', {
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
				changeToLogin();
			}
		}
		getUserInfo();
	}, [cookies]);

	if (!userInfos)
		return null;

	return (
		<Stack direction="row" spacing={2}>
			<div className="dropdown">
				<button className='profil-button' onClick={toggleDropdown}>
					<Avatar alt="profil picture" src={userInfos['photo']} />
					<Divider>
						<Typography>
							{userInfos['login']}
						</Typography>
					</Divider>
				</button>
				{isOpen && (
					<ul className="dropdown-options">
						{options.map((option) => (
							<li key={option.url}>
								< Link to={option.url}>{option.title}</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</Stack>
	);
}