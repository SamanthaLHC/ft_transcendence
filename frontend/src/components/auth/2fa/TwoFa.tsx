import { useState, useEffect } from 'react';
import OtpInput from './OtpInput';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export type Props = {
	value: string;
	valueLength: number;
	onChange: (value: string) => void;
};

const TwoFa = () => {

	const navigate = useNavigate();
	const [cookies, setCookie] = useCookies(["access_token"]);
	const [otp, setOtp] = useState('');
	const [showInvalidOTP, setShowInvalidOTP] = useState(false);

	useEffect(() => {
		if (!cookies.access_token) {
			navigate("/");
		}
	}, [cookies.access_token, navigate]);

	const onChange = (value: string) => setOtp(value);

	const handleClick = async () => {
		if (otp) {
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
				console.log(datas);
				if (datas.status === 302) {
					console.log("DATAS STATUS IS 302");
					setCookie("access_token", datas.access_token, { path: "/" });
					const tmp = new URL(datas.url);
					console.log("URL IS: ", tmp.pathname);
					navigate(tmp.pathname);
				}
				else {
					setShowInvalidOTP(true);
					console.log("INVALID OTP: ", otp);
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<div className="qr">
			<h1 className='typo-friends yellow'>Enter the code provided by google authenticator</h1>
			<OtpInput value={otp} valueLength={6} onChange={onChange} />
			<button className='btn-size qr-image' onClick={handleClick}>validate</button>
			{showInvalidOTP && (
				<div className='popup'>
					<p>Invalid code. Please try again</p>
					<button className='btn-size qr-image' onClick={() => setShowInvalidOTP(false)}>Close</button>
				</div>
			)}
		</div>
	);
}

export default TwoFa;