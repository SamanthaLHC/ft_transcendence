import React from 'react';
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Header from './header/Header';
import ButtonPlay from './ButtonPlay';
import Friends from './friends/Friends';


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
				<ButtonPlay />
			</div>
		</React.Fragment>
	)
}






