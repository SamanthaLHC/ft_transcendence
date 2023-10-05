import React from 'react'
import { useState, useEffect } from 'react'
import { useCookies } from "react-cookie";
import Header from '../header/Header'
import Friends from '../friends/Friends'

const Settings: React.FC = () => {

	//_____________________handle enable2fa__________________________________________
	const [active2fa, setActive2fa] = useState(false);
	const [cookies] = useCookies(["access_token"]);

	const handleClick = () => {
		setActive2fa(!active2fa);
	}
	//TODO  else disable 2fa

	console.log("2fa status: enable -> ", active2fa);

	useEffect(() => {
		if (active2fa) {
			async function enableTwofa() {

				const req: Request = new Request('http://localhost:3000/auth/2fa/turn-on', {
					method: "POST",
					headers: {
						"Authorization": `Bearer ${cookies.access_token}`,
					},
				});

				const response = await fetch(req);
				const datas = await response.json();
				console.log("datas in response: ", datas);
			}
			enableTwofa();
		}
	}, [cookies.access_token]);

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