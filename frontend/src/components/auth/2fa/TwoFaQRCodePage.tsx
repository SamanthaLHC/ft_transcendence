import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useParams } from 'react-router-dom';
import TwoFa from './TwoFa';

interface ImgProps {
	imageUrl: string;
}

const TwoFaQRCodePage: React.FC<ImgProps> = () => {

	const { imageUrl } = useParams();
	// const navigate = useNavigate();

	// const handleRedirect = () => {
	// 	navigate('/home');
	// };

	return (
		<div className='image-center'>
			<div className='qr'>
				<h1 className='typo-channel'>Scan this QR code with google authenticator</h1>
				<img className='qr-image'
					src={imageUrl}
					alt="QR Code"
				/>
				<TwoFa />
				{/* <button className='btn-size' onClick={handleRedirect}>Back to home</button> */}
			</div>
		</div>
	);
};

export default TwoFaQRCodePage;
