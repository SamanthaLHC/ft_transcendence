import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Login from '../auth/Login';


//ONGOING //FIXME : multiple appels de ProfileSpace menant à des bad queries

export default function ProfilSpace() {

	const [cookies] = useCookies(["access_token"]);
	const [userInfos, setUserInfos] = useState(null);
	const [firstFetch, setFirstFetch] = useState(true);
	const [error, setError] = useState(null);


	useEffect(() => {
		async function getUserInfo() {

			if (userInfos === null && firstFetch === true) {
				setFirstFetch(false);

				console.log("=====================FETCH GET user info call====================== ");
				const req = new Request('http://localhost:3000/users/me', {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${cookies.access_token}`,
					},
				});

				const response = await fetch(req);
				var datas = await response.json();
				console.log("response status: ", response.status);
				if (response.status === 200 || response.status === 304) {
					setUserInfos(datas);
				}
			}
			else
			{
				console.log("FETCH DEJA LANCÉ");
			}
		}
		if (userInfos === null) {
			console.log("COIN COIN COUCOU");
			getUserInfo();
		}
	}, []);

	if (userInfos === null) {

		console.log("setUserInfos did not work propwerly (in if userInfos === null in Profil SPace)");
		console.log("return id no datas");
		// setError(error);
		return <div> no user </div>;
	}
	console.log("before return with datas");
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