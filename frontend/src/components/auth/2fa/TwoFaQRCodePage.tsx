import React from 'react';
import { useParams } from 'react-router-dom';
import EnableTwoFa from './EnableTwoFa';

interface ImgProps {
	imageUrl: string;
}

const TwoFaQRCodePage: React.FC<ImgProps> = () => {

	const { imageUrl } = useParams();

	return (
		<div className='qr-center'>
			<div className='qr'>
				<h1 className='typo-channel'>Scan this QR code with google authenticator</h1>
				<img className='qr-image'
					src={imageUrl}
					alt="QR Code"
				/>
				<EnableTwoFa />
			</div>
		</div>
	);
};

export default TwoFaQRCodePage;
