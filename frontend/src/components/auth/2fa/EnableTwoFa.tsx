import { useState, useEffect } from 'react';
import OtpInput from './OtpInput';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export type Props = {
    value: string;
    valueLength: number;
    onChange: (value: string) => void;
};

const EnableTwoFa = () => {

    const navigate = useNavigate();
    const [cookies] = useCookies(["access_token"]);
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (!cookies.access_token) {
            navigate("/");
        }
    }, [cookies.access_token, navigate]);

    const onChange = (value: string) => setOtp(value);

    const handleClose = () => {
        navigate("/home");
    }

    const handleClick = async () => {
        if (otp) {
            const obj = {
                code: otp
            };
            const req: Request = new Request('http://localhost:3000/users/2fa/validate', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${cookies.access_token}`,
                },
                body: JSON.stringify(obj),
            });

            try {
                const response = await fetch(req);
                if (response.ok) {
                    //here turn on request!
                    navigate("/home");
                }
                else {
                    alert("INVALID OTP ");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="qr-with-otp">
            <h1 className='typo-friends yellow'>Enter the code provided by google authenticator</h1>
            <OtpInput value={otp} valueLength={6} onChange={onChange} />
            <button className='btn-size qr-image' onClick={handleClick}>validate</button>
            <button className='btn-size qr-image' onClick={handleClose}>cancel</button>
        </div>
    );
}

export default EnableTwoFa;