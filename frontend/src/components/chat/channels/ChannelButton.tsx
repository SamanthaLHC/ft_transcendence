
import React, { useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useChatSocket } from '../../Context';
import { useCookies } from "react-cookie";
import { join } from "path";
import PasswordDialog from "./PasswordDialog";

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
	const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
	
	const changeChannel = (channel : Channel) => {
		socket.socket.emit('change_room', channel.name);
		socket.channel = channel
	}
	
	const joinChannel = (channel : Channel, password? : string) => {

		console.log('I must join', channel.name, '(ID:', channel.id, ')');
		const body = {
			password: 'kfjv',
			privacy: channel.privacy,
		};
		if (channel.privacy === "PASSWORD_PROTECTED") {
			if (password)
				body.password = password;
			else
			{
				setPasswordDialogOpen(true);
				return;
			}
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

	const handlePasswordJoin = (password: string) => {
		// Appeler ici la fonction pour rejoindre le canal avec le mot de passe
		joinChannel(channel, password);
		// Assurez-vous de fermer le dialogue après avoir traité le mot de passe
		setPasswordDialogOpen(false);
	  };

	return (
		<ListItem className="yellow">
		  <button className="profil-button" onClick={handleChannelClick}>
			<Divider>
			  <ListItemText />
			  {channel.name}
			</Divider>
		  </button>
		  <PasswordDialog
			open={isPasswordDialogOpen}
			onClose={() => setPasswordDialogOpen(false)}
			onJoin={handlePasswordJoin}
		  />
		</ListItem>
	  );
};

export default ChannelButton;