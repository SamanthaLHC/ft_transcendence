import * as React from 'react';
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import ButtonPlay from './ButtonPlay';
import ButtonMenu from './ButtonMenu';
import { ThemeProvider } from '@emotion/react';

//TODO 4 seg in header => cluster button (redirect on click)
//TODO  => title with giphy duck
//TODO  => setting button
//TODO  => Profil user with request
//TODO => custom color and customn fon


// Augment the palette to include an ochre color
declare module '@mui/material/styles' {
	interface Palette {
		ochre: Palette['primary'];
	}

	interface PaletteOptions {
		ochre?: PaletteOptions['primary'];
	}
}

// Update the Button's color options to include an ochre option
declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		ochre: true;
	}
}

const theme = createTheme({
	palette: {
		ochre: {
			main: '#E3D026',
			light: '#E9DB5D',
			dark: '#A29415',
			contrastText: '#242105',
		},
	},

	typography: {
		fontFamily: "Vensfolk"
	}
});

export default function Header() {

	return (

		<React.Fragment>

			<Toolbar sx={{ borderBottom: 2, borderColor: 'ActiveBorder' }}>
				<ButtonMenu />

				{/* title section */}
				{/* img giphy */}
				<ThemeProvider theme={theme}>
					<Typography
						component="h1"
						variant="h4"
						fontFamily={"earthorbiter"}
						color="ochre.main"
						align="center"
						noWrap
						sx={{ flex: 1 }}
					>
						~Magical ducky pong~
					</Typography>

				</ThemeProvider>

				{/* img giphy */}


				<Button
					variant="outlined"
					size="small"
				// color='ochre'
				>
					Settings
				</Button>

			</Toolbar>
			{/* <ProfilButton /> */}
		</React.Fragment >
	)

}