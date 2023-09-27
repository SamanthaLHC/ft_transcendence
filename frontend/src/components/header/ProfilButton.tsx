import React from "react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Divider, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';




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


	let navToSettings = useNavigate();
	const changeToSettings = () => {
		let pathSettings = '/settings';
		navToSettings(pathSettings);
	}
	
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

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
			<button id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}>
				<Avatar alt="profil picture" src={userInfos['photo']} />
				<Divider>
					<Typography>
						{userInfos['login']}
					</Typography>
				</Divider>
			</button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}>
				<MenuItem onClick={changeToProfil}> View my profile </MenuItem>
				<MenuItem onClick={changeToSettings}> Settings </MenuItem>
				<MenuItem onClick={handleClose}> Logout </MenuItem>
			</Menu>
		</Stack>
	);
}