import React from 'react';
import Header from '../header/Header';
import LaunchButton from './LaunchButton';
import Friends from '../friends/Friends';


// TODO  : header (barre du haut)
// TODO  : friend list 
//TODO profil space
//TODO : add une marre aux canards en bg

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






