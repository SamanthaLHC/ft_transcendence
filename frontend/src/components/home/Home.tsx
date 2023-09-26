import React from 'react';
import Header from '../header/Header';
import LaunchButton from './LaunchButton';
import Friends from '../friends/Friends';

export default function Home() {
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






