import { useEffect, useState } from "react";
import React from "react";
import { useCookies } from "react-cookie";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Login from '../auth/Login';


//ONGOING //FIXME : multiple appels de ProfileSpace menant à des bad queries

export default function ProfilSpace() {

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
			var datas = await response.json();
			if (response.status === 200 || response.status === 304) {
				console.log(response.status);
				setUserInfos(datas);
			}
		}
		getUserInfo();
	}, []);

	if (userInfos === null) {
		console.log("recup des datas impossible");
		return <div> no user </div>;
	}

	return (
		<Stack direction="row" spacing={2}>
			<Avatar alt="profil picture" src={userInfos['photo']} />
			<Typography
				color={"beige"}>
				{userInfos['login']}
			</Typography>
		</Stack>
	);
}


// 	//TODO gerer le cas d erreur et la redirection
// TODO redirect rpofil page
// TODO cookie provider dans app et passer des param à tous les composanta ? 