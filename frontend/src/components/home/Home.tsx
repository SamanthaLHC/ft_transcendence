import './Home.css';
import Container from "@mui/material/Container"
// import { createTheme } from '@mui/material/styles';
import Grid from "@mui/material/Grid"
import Header from './header/Header';
import ButtonPlay from './ButtonPlay';


// TODO  : header (barre du haut)
// TODO  : friend list 
//TODO : add une marre aux cabards en bg


function Home() {

	return (
		<Container>
			<Header />
			<Grid sx={{ mt: 20 }}>
				<ButtonPlay />
			</Grid>
			{/* <Friends/> */}
		</Container>
	)
}

export default Home