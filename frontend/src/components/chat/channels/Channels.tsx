import React, { useEffect, useState } from "react";
import SearchBar from './SearchBar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from '@mui/material';
import { useCookies } from "react-cookie";
import CreateChannelForm from "./CreateChannelForm";
import ChannelButton from "./ChannelButton";
import { useChatSocket } from "../../Context";
import { useNavigate } from "react-router-dom";

interface Channel {
	id: number;
	name: string;
	displayname: string;
	privacy: string;
	joined: boolean;
}

const Channels: React.FC = () => {

	const [channels, setChannels] = useState<Channel[]>([]);
	const [cookies] = useCookies(["access_token"]);
	const [searchQuery, setSearchQuery] = useState("");
	const [channelCreated, setChannelCreated] = useState(false);
	const socket = useChatSocket()

	function getId(): string | null {
		let url_str: string = window.location.search;
		let strToSearch: URLSearchParams = new URLSearchParams(url_str);
		let code_param: string | null = strToSearch.get("mpid");
		console.log(code_param)
		return code_param;
	}

	const navToHome = useNavigate();
	const tochat = () => {
		let pathHome: string = '/chat';
		navToHome(pathHome);
	}


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
					console.log(data);
					const fetchedChannels = data.map((item: any) => {
						let newchan:Channel = item
						newchan.displayname = item.name
						console.log("coucou ", newchan)
						return newchan;
					});
					setChannels(fetchedChannels);
				})
				.catch((error) => {
					console.error("Error fetching channels:", error);
				});
		}

		const id = getId()
		if (id) {
			const req = new Request("http://localhost:3000/chat/channel/private/create/" + id, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			});

			fetch(req)
				.then((response) => response.json())
				.then((data) => {
					if (data.name) {
						tochat()
						socket.socket.emit('change_room', data.name);
						socket.channel = data
						getChannels()
					}
					else
					{
						console.log("nop")
						tochat()
					}
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
				socket.socket.emit('change_room', data.name);
				socket.channel = data
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
							<ChannelButton key={chan.id} channel={chan} />
						))}
					</ul>
				</div>
			</div>
		</React.Fragment>
	);
}
export default Channels;
