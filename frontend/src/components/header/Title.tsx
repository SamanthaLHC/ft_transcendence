import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles"
import { ThemeProvider } from '@emotion/react';
import giphy from '../../assets/giphy.gif'

const theme = createTheme({
	typography: {
		fontFamily: "Vensfolk"
	}
});

const Title: React.FC = () => {

	return (
		<ThemeProvider theme={theme}>
			<Typography
				component="h1"
				variant="h4"
				fontFamily={"earthorbiter"}
				style={{ color: '#ffc107' }}
				display={"flex"}
				alignItems={"center"}
				paddingLeft={"10%"}
				noWrap
				sx={{ flex: 1 }}
			>
				<img src={giphy} className='giphy' alt="gif" />
				~Magical ducky pong~
				<img src={giphy} className='giphy' alt="gif"/>
			</Typography>
		</ThemeProvider>
	)
}

export default Title;