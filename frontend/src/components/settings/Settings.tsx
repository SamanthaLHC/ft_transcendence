import React from 'react'
import { useState, useEffect, ChangeEvent } from 'react'
import { useCookies } from "react-cookie";
import Header from '../header/Header'
import Friends from '../friends/Friends'
import { useNavigate } from 'react-router-dom';
import { useUser } from "../Context";

const Settings: React.FC = () => {

	const [cookies] = useCookies(['access_token']);
	const [active2fa, setActive2fa] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState(''); // change name handle key event
	const [isInvalidNamePopupOpen, setIsInvalidNamePopupOpen] = useState(false); //handle popup
	const [isInvalidFileFormatPopupOpen, setIsInvalidFileFormatPopupOpen] = useState(false); // Handle file format error popup
	const [file, setFile] = useState<File | null>(null); // Store the selected file	
	const { userData, updateUserData } = useUser();
	const navigate = useNavigate(); // handle redirection

	//______________________________________________________________________________________
	//                           handle 2fa
	//______________________________________________________________________________________

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
	}, [cookies.access_token, setActive2fa]);

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

	//______________________________________________________________________________________
	//                           handle change name
	//______________________________________________________________________________________

	const handleTextareaKeyPress = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // prevent newline to be added

			if (inputValue) {
				const obj = {
					name: inputValue
				};
				const req: Request = new Request('http://localhost:3000/users/update_name', {
					method: "POST",
					headers: {
						"content-type": "application/json",
						"Authorization": `Bearer ${cookies.access_token}`,
					},
					body: JSON.stringify(obj),
				});

				try {
					const response = await fetch(req);
					if (!response.ok) {
						alert("Invalid Name. Already exist or is not between 1 and 15 caracters.");
					}
					else {
						updateUserData(userData.id, inputValue, userData.photo);
					}
				} catch (error) {
					console.error(error);
				}
			}
			setInputValue(''); //clear
		}
	};

	//______________________________________________________________________________________
	//                           handle change avatar
	//______________________________________________________________________________________

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	useEffect(() => {
		if (file) {
			uploadAvatar();
		}
	}, [file]);

	const uploadAvatar = async () => {
		if (file) {
			const formData = new FormData();
			formData.append('file', file);
			try {
				const req = new Request("http://localhost:3000/users/upload", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
					},
					body: formData,
				});

				const response = await fetch(req);
				if (response.ok) {
					const responseStr = await response.text();
					updateUserData(userData.id, userData.name, responseStr);
				} else {
					alert("Invalid file: correct format are: (image/png, image/jpeg, image/gif).");
				}
			} catch (error) {
				console.error(error);
				alert("Invalid file: correct format are: (image/png, image/jpeg, image/gif).");
			}
		}
	};

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='content-page'>
					<div className='list-items'>
						<div className='change-name'>
							<h3 className='typo-settings'> Change your name: </h3>
							<br />
							<textarea id="inputName" name="inputName" value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={handleTextareaKeyPress}
							/>
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
							<button className="btn-size" onClick={() => document.getElementById('fileInput')?.click()}>
								Change your avatar
							</button>
							<input
								id="fileInput"
								type="file"
								accept="image/png,image/jpeg,image/gif"
								style={{ display: 'none' }}
								onChange={handleFileChange}
							/>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment >
	);
};

export default Settings;