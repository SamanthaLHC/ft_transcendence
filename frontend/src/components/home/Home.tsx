import './Home.css';
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
			< Box sx={{ flexGrow: 1, height: '100vh' }}>
				<Grid>
					<Header/>
				</Grid>
				<Grid container spacing={-1}
					justifyContent={"flex-start"}
					alignItems={"center"}>
					<Grid>
						<Friends />
					</Grid>
					<Grid sx={{ display: 'flex', justifyContent: 'center', width: '70%' }}>
						<Grid sx={{ display: 'flex', justifyContent: 'center' }}>
							<ButtonPlay />
						</Grid>
					</Grid>
				</Grid>
			</Box >
		</React.Fragment>
	)
}






