import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useParams } from 'react-router-dom';

interface ImgProps {
	imageUrl: string;
}

const TwoFaQRCodePage: React.FC<ImgProps> = () => {

	const { imageUrl } = useParams();
	const navigate = useNavigate();

	const handleRedirect = () => {
		navigate('/2fa');
	};

	return (
		<div className='qr'>
			<h1 className='typo-channel'>Scan this QR code with google authenticator</h1>
			<br />
			<img className='qr-image'
				src={imageUrl}
				alt="QR Code"
			/>

			<button className='btn-size' onClick={handleRedirect}>Click here to enter your 2fa code</button>
		</div>
	);
};

export default TwoFaQRCodePage;
