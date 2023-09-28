import React from 'react';
import Header from '../header/Header';
import LaunchButton from './LaunchButton';
import Friends from '../friends/Friends';

const Home: React.FC = () => {
	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<LaunchButton />
			</div>
		</React.Fragment>
	)
}

export default Home;





