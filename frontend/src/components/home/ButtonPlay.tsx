import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

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


function ButtonPlay() {
	return (


		<ThemeProvider theme={theme}>
			<Grid
				container spacing={2}
				justifyContent={"center"}
				alignItems={"center"}
			>
				<Button
					sx={{ width: 200, height: 90 }}
					variant="contained"
					size='large'
					color="ochre"

				>
					Play this magical game, right now!
				</Button>

			</Grid>


		// </ThemeProvider >
	);
}

export default ButtonPlay

// TODO onclick()