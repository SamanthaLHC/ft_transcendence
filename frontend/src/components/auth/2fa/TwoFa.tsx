import React, { useRef, useEffect, useState } from 'react';
import OtpInput from './OtpInput';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export type Props = {
	value: string;
	valueLength: number;
	onChange: (value: string) => void;
};

const TwoFa = () => {

	const [otp, setOtp] = useState('');
	const onChange = (value: string) => setOtp(value);
	const [cookies, setCookie] = useCookies(["access_token"]);
	const navigate = useNavigate();



	const handleClick = async () => {
		if (otp) {
			console.log("otp is: ", otp);

			const obj = {
				code: otp
			};
			const req: Request = new Request('http://localhost:3000/auth/2fa', {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"Authorization": `Bearer ${cookies.access_token}`,
				},
				body: JSON.stringify(obj),
			});

			try {
				const response = await fetch(req);
				const datas = await response.json();
				if (datas.status === 302) {
					console.log("status response for the fetch POST OTP: ", datas.status)
					setCookie("access_token", datas.access_token, { path: "/" });
					console.log("new token is : ", cookies.access_token);
					const tmp = new URL(datas.url);
					navigate(tmp.pathname);
				}
			} catch (error) {
				console.error(error);
				navigate("/");
			}
		}
	};

	return (
		<div className="qr">
			<h1 className='typo-friends yellow'>Enter the code provided by google authenticator</h1>
			<OtpInput value={otp} valueLength={6} onChange={onChange} />
			<button className='btn-size qr-image' onClick={handleClick}>validate</button>
		</div>
	);
}

export default TwoFa;