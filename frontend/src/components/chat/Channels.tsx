import React, { useEffect, useState } from "react";
import SearchBar from '../friends/SearchBar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from '@mui/material';
import { Divider } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useCookies } from "react-cookie";

interface Channel {
	name: string;
}

const Channels: React.FC = () => {

	const [channels, setChannels] = useState<Channel[]>([]);

	const [cookies] = useCookies(["access_token"]);

	useEffect(() => {
		async function getChannels() {
			const req = new Request("http://localhost:3000/chat/channels/joined", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			});

			try {
				const response = await fetch(req);
				const data = await response.json();
				console.log(data);

				// Extract channel names from the fetched data
				const fetchedChannels = data.map((item: any) => {
					return { name: item.channel.name };
				});

				setChannels(fetchedChannels);
			} catch (error) {
				console.error("Error fetching channels:", error);
			}
		}

		if (cookies.access_token) {
			getChannels();
		}
	}, [cookies.access_token]);

	// handle dropdown menu _________________________________________

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	// console.log(chan[0].name);
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
					<ul className="typo yellow list">
						{channels.map((channel) => (
							<ListItem className="yellow" key={channel.name}>
								<button className="profil-button">
									<Divider>
										<ListItemText />
										{channel.name}
									</Divider>
								</button>
							</ListItem>
						))}
					</ul>
				</div>
			</div>
		</React.Fragment>
	);
}
export default Channels;
