import React from "react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Divider, Typography } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useUser } from "../Context";


const ProfilButton: React.FC = () => {

	// console.log("Profil button call");
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [cookies] = useCookies(["access_token"]);
	const [userInfos, setUserInfos] = useState(null);
	const { userData, updateUserData } = useUser();

	//redirect on click_______________________________________________

	const navToProfil: NavigateFunction = useNavigate();
	const changeToProfil = () => {
		let pathProfil: string = '/profil';
		navToProfil(pathProfil);
	}

	const navToLogin: NavigateFunction = useNavigate();
	const changeToLogin = () => {
		let pathLogin: string = '/';
		navToLogin(pathLogin);
	}

	const navToSettings: NavigateFunction = useNavigate();
	const changeToSettings = () => {
		let pathSettings: string = '/settings';
		navToSettings(pathSettings);
	}

	// handle dropdown menu _________________________________________


	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	// handle log out __________________________________________________

	const LogOut = () => {
		//TODO clear cookies !
		changeToLogin();
	}

	// handle bearer token cookie and set user datas______________________


	// console.warn(`Rendering Profile, cookie=${cookies.access_token}`);
	useEffect(() => {
		async function getUserInfo() {

			const req: Request = new Request('http://localhost:3000/users/me', {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			});

			const response = await fetch(req);
			const datas = await response.json();
			if (response.status === 200 || response.status === 304) {
				setUserInfos(datas);
				updateUserData(datas.name, datas.photo);
			}
			else {
				changeToLogin();
			}
		}
		getUserInfo();
	}, [cookies.access_token]);

	if (!userInfos)
		return null;

	return (
		<Stack direction="row" spacing={2}>
			<button className="profil-button" id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}>
				<Avatar alt="profil picture" src={userInfos['photo']} />
				<Divider>
					<Typography>
						{userData.name}
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
				<MenuItem onClick={LogOut}> Logout </MenuItem>
			</Menu>
		</Stack>
	);
}

export default ProfilButton;