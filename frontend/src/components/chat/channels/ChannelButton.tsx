
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useChatSocket } from '../../Context';

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

	const changeChannel = (channel : Channel) => {
		socket.socket.emit('change_room', channel.name);
		socket.channel = channel
	}

	const handleChannelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		changeChannel(channel)
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