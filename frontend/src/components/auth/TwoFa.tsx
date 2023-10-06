import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const TwoFa: React.FC = () => {

	const navigate = useNavigate();

	const handleRedirect = () => {
		navigate('/home');
	};

	return (
		<div className='qr'>
			<h1 className='typo-channel'>Type your google authenticator code:</h1>
			<br />
			<textarea className='input-2fa' />
		</div>
	);
};

export default TwoFa;
