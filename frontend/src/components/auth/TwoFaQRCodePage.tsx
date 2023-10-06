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
		navigate('/home');
	};

	return (
		<div id='container'>
			<h1 className='typo-settings'>QR Code Page</h1>
			<img className='img-center'
				src={imageUrl}
				alt="QR Code"
			/>

			<button onClick={handleRedirect}>Back to home</button>
		</div>
	);
};

export default TwoFaQRCodePage;
