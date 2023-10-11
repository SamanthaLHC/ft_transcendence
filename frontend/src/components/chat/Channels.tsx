import React, { useEffect, useState } from "react";
import SearchBar from './SearchBar';
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
	const [searchQuery, setSearchQuery] = useState("");
	const [channelName, setChannelName] = useState("");


	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
	};

	useEffect(() => {
		async function getChannels() {

			let uri_str: string
			if (searchQuery === '')
				uri_str = 'http://localhost:3000/chat/channels/joined'
			else 
				uri_str = 'http://localhost:3000/chat/channel?search=' + searchQuery

			const req = new Request(uri_str, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			});

			try {
				const response = await fetch(req);
				const data = await response.json();
				const fetchedChannels = data.map((item: any) => {
					return { name: item.name };
				});

				setChannels(fetchedChannels);
			} catch (error) {
				console.error("Error fetching channels:", error);
			}
		}

		if (cookies.access_token) {
			getChannels();
		}
	}, [cookies.access_token, searchQuery]);

	// handle dropdown menu _________________________________________

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	useEffect ( () => {
		async function sendChanRequest(name: string) {
			name = "Pouet"
			console.log("http://localhost:3000/chat/channel/" + name)
			const req = new Request("http://localhost:3000/chat/channel/" + name, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			try {
				const response = await fetch(req)
				const data = response.json()
				console.log(data)
			}
			catch (error) {
				console.log ("Error in Channel switching : ", error)
			}
		}
		sendChanRequest(channelName)

	},[cookies.access_token, channelName])
	
	const handleChannelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		console.log("handleChannelClick:", event.currentTarget.textContent);
		if (event.currentTarget.textContent)
			setChannelName(event.currentTarget.textContent)
	}

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
				<SearchBar onSearchChange={handleSearchChange} />

				<div>
					<ul className="typo yellow list">
						{channels.map((channel) => (
							<ListItem className="yellow" key={channel.name}>
								<button className="profil-button" onClick={handleChannelClick}>
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
