import React from 'react'
import { useState, useEffect } from 'react'
import { useCookies } from "react-cookie";
import Header from '../header/Header'
import Friends from '../friends/Friends'
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {

	const [cookies] = useCookies(['access_token']);
	const [active2fa, setActive2fa] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>('');
	const navigate = useNavigate();



	useEffect(() => {

		const initTwofa = async () => {
			try {
				const req: Request = new Request('http://localhost:3000/users/2fa/state', {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
					},
				});

				const response = await fetch(req);
				const datas = await response.json();
				setActive2fa(datas.deuxfa);
			}
			catch (error) {
				console.error(error);
			}
		};
		initTwofa();
	}, [setActive2fa]);

	const enableTwofa = async () => {
		try {
			const req: Request = new Request('http://localhost:3000/users/2fa/turn-on', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			});

			const response = await fetch(req);
			const datas = await response.json();
			const imageBlob = await fetch(datas.otpAuthUrl).then((r) => r.blob()); // Fetch image as a Blob
			const imageUrl = window.URL.createObjectURL(imageBlob); // Create a URL for the Blob
			setImageUrl(imageUrl);
			navigate(`/qrcode/${encodeURIComponent(imageUrl)}`);
			setActive2fa(true);
		}
		catch (error) {
			console.error(error);
		}
	};

	const disableTwofa = async () => {
		try {
			const req: Request = new Request('http://localhost:3000/users/2fa/turn-off', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			});
			const response = await fetch(req);
			if (response.ok) {
				setActive2fa(false);
			}
			else {
				console.error(`Request failed with status: ${response.status}`);
			}
		}
		catch (error) {
			console.error(error);
		}
	};

	const handleClick = () => {
		if (!active2fa)
			enableTwofa();
		else
			disableTwofa();
	};

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div id='settings-content'>
					<div className='list-items'>
						<div className='change-name'>
							<h3 className='typo-settings'> Change your name: </h3>
							<br />
							<textarea />
						</div >
						<div className='btn-pos '>
							<button className="btn-size" onClick={handleClick}>{active2fa ? "Disable 2fa" : "Enable 2fa"}</button>
						</div>
						<div className='btn-pos'>
							<button className="btn-size" >game option 1</button>
						</div>
						<div className='btn-pos'>
							<button className="btn-size">game option 2</button>
						</div>
					</div>
					<div className='list-items'>
						<div className='btn-pos'>
							<button className="btn-size" >Change your avatar</button>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment >
	);
};

export default Settings;