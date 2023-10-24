
import React, { Component, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useChatSocket } from '../../Context';
import { useCookies } from "react-cookie";

interface Channel {
	id: number;
	name: string;
}

interface ChannelButtonProps {
	channel: Channel;
}


const ChannelButton: React.FC<ChannelButtonProps> = ({ channel }) => {
	const socket = useChatSocket()
	const [cookies] = useCookies(["access_token"]);
	console.log(channel)

	const handleChannelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		console.log("in handleChannelClick", event.currentTarget)
		const name = channel.name
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