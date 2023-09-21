import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import ButtonMenu from './ButtonMenu';
import SettingsButton from './SettingsButton'
import Title from './Title';
import ProfilSpace from './ProfilSpace';

//TODO 4 seg in header => cluster button (redirect on click)
//TODO  => Profil user with request


export default function Header() {

	return (

		<React.Fragment>
			<Toolbar sx={{ borderBottom: 4, borderColor: 'ActiveBorder' }}>
				<ButtonMenu />
				<Title />
				<ProfilSpace />
				<SettingsButton />
			</Toolbar>
		</React.Fragment >
	)

}