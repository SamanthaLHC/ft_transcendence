import './Home.css';
import Container from "@mui/material/Container"
// import { createTheme } from '@mui/material/styles';
import Grid from "@mui/material/Grid"
import Header from './Header';
import ButtonPlay from './ButtonPlay';


// TODO  : header (barre du haut)
// TODO  : big button
// TODO  : friend list 




function Home() {

	return (
		<Container>
			<Header />
			<Grid sx={{ mt: 20 }}>
				<ButtonPlay />
			</Grid>
			{/* <Friends/> */}
			{/* <Chat/> */}
		</Container>
	)
}

export default Home