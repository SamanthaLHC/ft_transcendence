import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import ButtonMenu from './ButtonMenu';
import SettingsButton from './SettingsButton'
import Title from './Title';
import ProfilSpace from './ProfilSpace';

export default function Header() {
	const headerStyle = {
		display: 'flex',
		alignItems: 'center', // Center vertically
		borderBottom: 4,
		borderColor: 'ActiveBorder',
	};
	return (
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
	)
}

//HERE j'ai enlevé reactfragments à voir s'il faiut le remettre
{/* <Toolbar sx={{ borderBottom: 4, borderColor: 'ActiveBorder' }}> */ }