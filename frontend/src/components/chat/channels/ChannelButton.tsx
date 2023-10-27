
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useChatSocket } from '../../Context';
import { useCookies } from "react-cookie";
import { join } from "path";

interface Channel {
	id: number;
	name: string;
	privacy: string;
}

interface ChannelButtonProps {
	channel: Channel;
}

const ChannelButton: React.FC<ChannelButtonProps> = ({ channel }) => {
	const socket = useChatSocket()
	const [cookies] = useCookies(["access_token"]);
	
	const changeChannel = (channel : Channel) => {
		socket.socket.emit('change_room', channel.name);
		socket.channel = channel
	}
	
	const joinChannel = (channel : Channel) => {

		console.log('I must join', channel.name, '(ID:', channel.id, ')');
		const body = {
			password: 'kfjv',
			privacy: channel.privacy,
		};
		// console.log(JSON.stringify(body));
		if (channel.privacy === "PASSWORD_PROTECTED") {
			// TODO: ask for password and add it to body
		}
		const req = new Request("http://localhost:3000/chat/channel/join/" + channel.id, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body)
		})
		fetch(req)
			.then((response) => response.json())
			.then((data) => {
				if (data.message) // if error
					console.log(data.message);
				else {
					console.log('successfully joined');
					changeChannel(channel)
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const handleChannelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		joinChannel(channel);
	}

	return (
		<ListItem className="yellow">
			<button className="profil-button" onClick={handleChannelClick}>
				<Divider>
					<ListItemText />
					{channel.name}
				</Divider>
			</button>
		</ListItem>
	);
};

export default ChannelButton;