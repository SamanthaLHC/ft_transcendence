import React from "react";
import SearchBar from '../friends/SearchBar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from '@mui/material';
import { Divider } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface Channel {
	name: string;
}


const Channels: React.FC = () => {

	const chan: Channel[] = [
		{
			'name': "chan 1",
		},
		{
			'name': "chan 2",
		},
		{
			'name': "chan 3",
		},

	];
	// handle dropdown menu _________________________________________

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<React.Fragment>
			<div
				className='channels'>
				<h5 className='typo-channel yellow'>
					Channels
					<IconButton className='add-button'
						aria-controls={open ? 'basic-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}>
						<AddCircleIcon />
					</IconButton>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}>
						<MenuItem > name: </MenuItem>
						<MenuItem > public/private </MenuItem>
						<MenuItem > password </MenuItem>
					</Menu>
				</h5>
				<SearchBar />
				<div>
					<ul className='typo yellow list'>
						{chan.map(((channel) => (
							<ListItem className='yellow' key={channel.name}>
								<button className='profil-button'>
									<Divider>
										<ListItemText />
										{channel.name}
									</Divider>
								</button>
							</ListItem>
						)))}
					</ul>
				</div>
			</div>
		</React.Fragment >
	);
}
export default Channels;
