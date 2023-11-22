import React from 'react';
import logo from '../../assets/duck.png';
import AuthProcess from './Auth';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const clientid = process.env.REACT_APP_CLIENT_ID;

const Login: React.FC = () => {
	const [cookies, , removeCookie] = useCookies(["access_token"]);
	const navigate = useNavigate();
	
	if (cookies.access_token) {
		const req: Request = new Request('http://' + process.env.REACT_APP_HOSTNAME + ':3000/users/me', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${cookies.access_token}`,
			},
		});

		fetch(req)
			.then((response) => {
				if (response.status === 200 || response.status === 304) {
					navigate("/home");
				}
				else {
					removeCookie("access_token", { path: "/" });
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
	    <React.Fragment>
			<AuthProcess />
			<div className="Login">
				<header className="Login-header">
					<img src={logo} className="Login-logo" alt="logo" />
					<h1>
						~ Magical ducky pong ~
					</h1>
					<a
						className="Login-link"
						href={`https://api.intra.42.fr/oauth/authorize?client_id=${clientid}&redirect_uri=http%3A%2F%2F` + process.env.REACT_APP_HOSTNAME + `%3A8000%2F&response_type=code`}
					>
						Connexion with 42
					</a>
					<a
						className="Login-link"
						href={`http://` + process.env.REACT_APP_HOSTNAME + `:8000/?code=test`}
					>
						Connexion with test
					</a>
				</header>
			</div>
		</React.Fragment>
	);
}
export default Login;