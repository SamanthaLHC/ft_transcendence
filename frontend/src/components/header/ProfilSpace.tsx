import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { useNavigate } from "react-router";

//ONGOING //FIXME : multiple appels de ProfileSpace menant à des bad queries

export default function ProfilSpace() {

	let navToProfil = useNavigate();
	const changeToProfil = () => {
		let pathProfil = '/profil';
		navToProfil(pathProfil);
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
			var datas = await response.json();
			if (response.status === 200 || response.status === 304) {
				console.log(response.status);
				setUserInfos(datas);
			}
		}
		getUserInfo();
	}, []);

	if (userInfos != null) {
		return (
			<Stack direction="row" spacing={2}>
				<button className='profil-button' onClick={changeToProfil}>
					<Avatar alt="profil picture" src={userInfos['photo']} />
					<Typography>
						{userInfos['login']}
					</Typography>
				</button>
			</Stack>
		);
	}
	else {
		console.log("recup des datas impossible");
		return <div> no user </div>;
	}
}