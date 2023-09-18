import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';


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
		fontFamily: "azonix"
	}
});

export default function ButtonMenu() {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'flex-start',
			}}
		>
			<ThemeProvider theme={theme}>
				<Button
					variant="outlined"
					color='ochre'
				>
					Settings
				</Button>

			</ThemeProvider>

		</Box >
	);
}