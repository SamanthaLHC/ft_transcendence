import React, { useEffect, useState } from "react";
import SearchBar from './SearchBar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from '@mui/material';
import { Divider } from '@mui/material';
import { useCookies } from "react-cookie";
import CreateChannelForm from "./CreateChannelForm";
import { useChatSocket } from '../Context';

interface Channel {
	name: string;
}

const Channels: React.FC = () => {

	const [channels, setChannels] = useState<Channel[]>([]);
	const [cookies] = useCookies(["access_token"]);
	const [searchQuery, setSearchQuery] = useState("");
	const [channelCreated, setChannelCreated] = useState(false);


	const socket = useChatSocket()
	
	
	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
	};
	
	useEffect(() => {
		async function getChannels() {
			console.log("getChannels:", searchQuery);
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
					console.log("feteched channels: ", fetchedChannels)
					channels.push({name: "test"})
					setChannels(fetchedChannels);
					console.log ("channels: ", channels)
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
					console.log("Error:", data.message);
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

	const handleChannelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const name = event.currentTarget.textContent
		console.log("handleChannelClick:", name);
		socket.socket.emit('change_room', name);
		if (name)
			socket.room = name
		const req = new Request("http://localhost:3000/chat/channel/" + name, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			},
		})
		fetch(req)
			.then((response) => response.json())
			.then((data) => {
				console.log("data:", data);
			})
			.catch((error) => {
				console.error("Error fetching channels:", error);
			});
	}

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
					<CreateChannelForm
						isOpen={open}
						onSubmit={handleSubmit}
					/>
					
				</h5>
				<SearchBar onSearchChange={handleSearchChange} updateChannels={handleUpdateChannels}/>

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
