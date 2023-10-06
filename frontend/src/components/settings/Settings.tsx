import React from 'react'
import { useState, useEffect } from 'react'
import { useCookies } from "react-cookie";
import Header from '../header/Header'
import Friends from '../friends/Friends'
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
	const [active2fa, setActive2fa] = useState<boolean>(false);
	const [cookies] = useCookies(['access_token']);
	const [imageUrl, setImageUrl] = useState<string>('');
	const navigate = useNavigate();

	useEffect(() => {
		if (active2fa) {
			enableTwofa();
		} else {
			disableTwofa();
		}
	}, [active2fa]);

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
			console.log('datas in response:', datas);
			const imageBlob = await fetch(datas.otpAuthUrl).then((r) => r.blob()); // Fetch image as a Blob
			const imageUrl = window.URL.createObjectURL(imageBlob); // Create a URL for the Blob
			setImageUrl(imageUrl);
			navigate(`/qrcode/${encodeURIComponent(imageUrl)}`);
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
			const datas = await response.json();
			console.log('datas in response when 2fa turned off:', datas);
		} catch (error) {
			console.error(error);
		}
	};

	const handleClick = () => {
		setActive2fa(!active2fa);
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
					<div className='item-pos avatar-btn'>
						<button className="btn-size" >Change your avatar</button>
					</div>
				</div>
			</div>
		</React.Fragment >
	);
};

export default Settings;