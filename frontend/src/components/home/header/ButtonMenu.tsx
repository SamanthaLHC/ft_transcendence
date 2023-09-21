import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
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
			main: '#ffc107'
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

				<ButtonGroup
					variant="outlined"
					aria-label="outlined button group">
					<Button
						size='small'
						color='ochre'
					>
						Chat
					</Button>
					<Button
						size='small'
						color='ochre'
					>
						Game
					</Button>
				</ButtonGroup>
			</ThemeProvider>
		</Box >
	);
}

// TODO redirect chat
// TODO redirect home avec bouton game (ou lancer directement une partie)
