import './Home.css';
import React from 'react';
import Container from "@mui/material/Container"
// import { createTheme } from '@mui/material/styles';
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import { styled } from '@mui/material/styles';
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
			< Box sx={{ flexGrow: 1 }}>
				<Grid>
					<Header />
				</Grid>
				<Grid container spacing={-1}
					justifyContent={"flex-start"}
					alignItems={"center"}>
					<Grid>
						<Friends />
					</Grid>
					<Grid paddingLeft={15}>
						<ButtonPlay />
					</Grid>
				</Grid>
			</Box >
		</React.Fragment>
	)
}





