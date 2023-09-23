// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import coin from '../../assets/Rubber_Duck_in_Parramatta_Park.jpg'



export default function ButtonPlay() {
	return (
			<div className='launch-game'
			style={{ backgroundImage: `url(${coin})` }} >
				<button>
					Play this magical game, right now !
				</button>
			</div>	

	);
}

// // Augment the palette to include an ochre color
// declare module '@mui/material/styles' {
// 	interface Palette {
// 		ochre: Palette['primary'];
// 	}

// 	interface PaletteOptions {
// 		ochre?: PaletteOptions['primary'];
// 	}
// }

// // Update the Button's color options to include an ochre option
// declare module '@mui/material/Button' {
// 	interface ButtonPropsColorOverrides {
// 		ochre: true;
// 	}
// }

// const theme = createTheme({
// 	palette: {
// 		ochre: {
// 			main: '#ffc107'
// 		},
// 	},

// 	typography: {
// 		fontFamily: "Azonix"
// 	}
// });


// function ButtonPlay() {
// 	return (


// 		<ThemeProvider theme={theme}>
// 			<Button
// 				sx={{ width: 200, height: 90 }}
// 				variant="contained"
// 				size='large'
// 				color="ochre"
// 			>
// 				Play this magical game, right now!
// 			</Button>
// 		</ThemeProvider >
// 	);
// }

// export default ButtonPlay

