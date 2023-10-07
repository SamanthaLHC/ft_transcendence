import React, { useRef, useEffect, useState } from 'react';
import OtpInput from './OtpInput';

export type Props = {
	value: string;
	valueLength: number;
	onChange: (value: string) => void;
};

const TwoFa = () => {

	const [otp, setOtp] = useState('');
	const onChange = (value: string) => setOtp(value);

	return (
		<div className="qr">
			<h1 className='typo-friends yellow'>Enter the code provided by google authenticator</h1>
			<OtpInput value={otp} valueLength={6} onChange={onChange} />
		</div>
	);
}

export default TwoFa;