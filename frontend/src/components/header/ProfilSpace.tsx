import React from "react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Divider, Typography } from '@mui/material';
import { useNavigate } from "react-router";


export default function ProfilSpace() {

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
			else if(response.status === 401)
			{
				changeToLogin();
			}
		}
		getUserInfo();
	}, [userInfos, cookies]);

	if (userInfos != null) {
		return (
			<Stack direction="row" spacing={2}>
				<button className='profil-button' onClick={changeToProfil}>
					<Avatar alt="profil picture" src={userInfos['photo']} />
					<Divider>
					<Typography>
						{userInfos['login']}
					</Typography>
					</Divider>
				</button>
			</Stack>
		);
	}
	return<React.Fragment/>
}