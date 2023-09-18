import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles"
import { ThemeProvider } from '@emotion/react';
import giphy from '../../../assets/giphy.gif'
import './giphy.css'

const theme = createTheme({
	typography: {
		fontFamily: "Vensfolk"
	}
});

export default function TestingModule() {

	return (
		<ThemeProvider theme={theme}>

			<Typography
				component="h1"
				variant="h4"
				fontFamily={"earthorbiter"}
				style={{ color: '#ffc107' }}
				display={"flex"}
				alignItems={"center"}
				align="center"
				noWrap
				sx={{ flex: 1 }}
			>
				<img src={giphy} className='giphy' />
				~Magical ducky pong~
				<img src={giphy} className='giphy' />
			</Typography>
		</ThemeProvider>


	)
}