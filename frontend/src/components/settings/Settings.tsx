import React from 'react'
import { converBase64ToImage } from 'convert-base64-to-image'
import { useState } from 'react'
import { useCookies } from "react-cookie";
import Header from '../header/Header'
import Friends from '../friends/Friends'

const Settings: React.FC = () => {

	//_____________________handle enable2fa__________________________________________
	// const initial2faState = ;
	const [active2fa, setActive2fa] = useState(false); // remplacer false par initial2faState
	const [cookies] = useCookies(["access_token"]);

	const handleClick = () => {
		setActive2fa(!active2fa);
	}
	//TODO  else disable 2fa

	console.log("2fa status: enable -> ", active2fa);

	if (active2fa) {
		async function enableTwofa() {

			const req: Request = new Request('http://localhost:3000/users/2fa/turn-on', {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${cookies.access_token}`,
				},
			});

			try {
				const response = await fetch(req);
				const datas = await response.json();
				console.log("datas in response: ", datas);
				const codeToConv: string = datas.otpAuthUrl;
				console.log("codeToConv is: ", codeToConv);
				const pathToSaveImage: string = '../../assets/qrcode.png';
				const imgConvert = converBase64ToImage(codeToConv, pathToSaveImage);
			} catch (error) {
				console.error(error);
			}
		}
		enableTwofa();
	}
	// else
	// {
	// 	async function disableTwofa() {

	// 		const req: Request = new Request('http://localhost:3000/users/2fa/turn-off', {
	// 			method: "POST",
	// 			headers: {
	// 				"Authorization": `Bearer ${cookies.access_token}`,
	// 			},
	// 		});

	// 		try {

	// 			const response = await fetch(req);
	// 			const datas = await response.json();
	// 			console.log("datas in response when 2fa turned off: ", datas);
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	}
	// 	disableTwofa();
	// }

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div id='settings-content'>
					<div className='list-items'>
						<div className='change-name'>
							<h3 className='typo-settings'> Change your name: </h3>
							<textarea />
						</div>
						<div className='btn-pos'>
							<button onClick={handleClick}>{active2fa ? "Disable 2fa" : "Enable 2fa"}</button>
						</div>
						<div className='btn-pos'>
							<button  >game option 1</button>
						</div>
						<div className='btn-pos'>
							<button  >game option 2</button>
						</div>
					</div>
					<div className='item-pos avatar-btn'>
						<button  >Change your avatar</button>
					</div>
				</div>
			</div>
		</React.Fragment >
	)
}

export default Settings;