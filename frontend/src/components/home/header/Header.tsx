import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import ButtonMenu from './ButtonMenu';
import SettingsButton from './SettingsButton'
import Title from './Title';
import ProfilSpace from './ProfilSpace';

//TODO 4 seg in header => cluster button (redirect on click)
//TODO  => Profil user with request


export default function Header() {
	const headerStyle = {
		display: 'flex',
		alignItems: 'center', // Center vertically
		borderBottom: 4,
		borderColor: 'ActiveBorder',
	};
	return (

		<React.Fragment>
			{/* <Toolbar sx={{ borderBottom: 4, borderColor: 'ActiveBorder' }}> */}
			<Toolbar sx={headerStyle}>
				<ButtonMenu />
				<Title />
				<Divider orientation="vertical" flexItem>
					<ProfilSpace />
				</Divider>
				<Divider orientation="vertical" flexItem>
					<SettingsButton />
				</Divider>
			</Toolbar>
		</React.Fragment >
	)
}