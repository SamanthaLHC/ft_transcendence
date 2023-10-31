
import React, { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useChatSocket } from '../../Context';
import { useCookies } from "react-cookie";
import PasswordDialog from "./PasswordDialog";
import { useNavigate } from "react-router-dom";

interface Channel {
	id: number;
	name: string;
	privacy: string;
	joined: boolean;
}

interface ChannelButtonProps {
	channel: Channel;
}

const ChannelButton: React.FC<ChannelButtonProps> = ({ channel }) => {
	const socket = useChatSocket()
	const [cookies] = useCookies(["access_token"]);
	const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
	const [displayName, setDisplayName] = useState("");

	const changeChannel = (channel: Channel) => {
		socket.socket.emit('change_room', channel.name);
		socket.channel = channel
	}

	const joinChannel = (channel: Channel, password?: string) => {

		console.log('I must join', channel.name, '(ID:', channel.id, ')');
		console.log(channel);
		const body = {
			password: '',
			privacy: channel.privacy,
		};
		if (channel.privacy === "PASSWORD_PROTECTED" && channel.joined === false) {
			if (password)
				body.password = password;
			else {
				setPasswordDialogOpen(true);
				return;
			}
		}
		if (channel.joined === false) {
			console.log('joining channel')
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
					if (data.message) { // if error
						console.log(data.message);
						alert(data.message);
					}
					else {
						console.log('successfully joined');
						changeChannel(channel);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
		else
		{
			console.log('user already in channel');
			changeChannel(channel);
		}
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

	useEffect(() => {

		const getnamedm = async (id: number) => {
			const req = new Request("http://localhost:3000/chat/channel/private/getname/" + id, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			});
	
			await fetch(req)
				.then((response) => response.json())
				.then((data) => {
					if (data) { // if error
						console.log("return ", data.name)
						setDisplayName("[DM] " + data.name);
						// socket.channel.name = "[DM] " + data.name
					}
				})
				.catch((error) => {
					console.error("Error fetching channels:", error);
				});
		};
        const fetchData = async () => {
            if (channel.privacy === "PRIVATE") {
                await getnamedm(channel.id);
            }
        };

        fetchData();
    }, [channel]);
	return (
		<ListItem className="yellow">
			<button className="profil-button" onClick={handleChannelClick}>
				<Divider>
					<ListItemText />
					{displayName || channel.name}
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