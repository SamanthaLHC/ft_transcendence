import React, { useEffect, useState } from "react";
import SearchBar from './SearchBar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from '@mui/material';
import { useCookies } from "react-cookie";
import CreateChannelForm from "./CreateChannelForm";
import ChannelButton from "./ChannelButton";

interface Channel {
	id: number;
	name: string;
}

const Channels: React.FC = () => {

	const [channels, setChannels] = useState<Channel[]>([]);
	const [cookies] = useCookies(["access_token"]);
	const [searchQuery, setSearchQuery] = useState("");
	const [channelCreated, setChannelCreated] = useState(false);
	
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


			return fetch(req)
				.then((response) => response.json())
				.then((data) => {
					const fetchedChannels = data.map((item: any) => {
						return { name: item.name };
					});
					setChannels(fetchedChannels);
				})
				.catch((error) => {
					console.error("Error fetching channels:", error);
				});
		}

		if (channelCreated) {
			setChannelCreated(false);
		}
		else if (cookies.access_token) {
			getChannels();
		}
	}, [cookies.access_token, searchQuery, channelCreated]);

	// handle create channel _________________________________________

	const handleSubmit = (name: string, privacy: string, password?: string) => {
		const body = {
			name: name,
			privacy: privacy,
			password: password,
		};
		const req = new Request("http://localhost:3000/chat/channel/create", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
				"Content-Type": "application/json", // Specify content type
			},
			body: JSON.stringify(body),
		});

		fetch(req)
			.then((response) => response.json())
			.then((data) => {
				if (data.message) { // if error
					alert(data.message);
					return;
				}
				// TODO: change to new channel
				setChannelCreated(true);
				handleClose();
			})
			.catch((error) => {
				console.error("Error fetching channels:", error);
			});
	}

	const handleUpdateChannels = () => {
		setChannelCreated(true);
	}

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
		  <div className="channels">
			<h5 className="typo-channel yellow">
			  Channels
			  <IconButton
				className="add-button"
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			  >
				<AddCircleIcon />
			  </IconButton>
			  <CreateChannelForm isOpen={open} onSubmit={handleSubmit} />
			</h5>
			<SearchBar onSearchChange={handleSearchChange} updateChannels={handleUpdateChannels} />
	
			<div>
			  <ul className="typo yellow list">
				{channels.map((chan) => (
				  <ChannelButton key={chan.name} channel={chan} />
				))}
			  </ul>
			</div>
		  </div>
		</React.Fragment>
	  );
}
export default Channels;
