import React from 'react';
import logo from '../../assets/duck.png';
import AuthProcess from './Auth';

const clientid = process.env.REACT_APP_CLIENT_ID;

const Login: React.FC = () => {
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
						href={`https://api.intra.42.fr/oauth/authorize?client_id=${clientid}&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&response_type=code`}
					>
						Connexion with 42
					</a>
					<a
						className="Login-link"
						href={`http://localhost:8000/?code=test`}
					>
						Connexion with test
					</a>
				</header>
			</div>
		</React.Fragment>
	);
}
export default Login;