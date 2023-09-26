import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import ButtonMenu from './ButtonMenu';
import Title from './Title';
import ProfilButton from './ProfilButton';

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
				<ProfilButton />
			</Divider>
		</Toolbar>
	)
}
