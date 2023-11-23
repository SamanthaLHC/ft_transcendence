import { Box, Button, ButtonGroup, createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import { socket, useUser } from '../Context'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

interface Message {
	id:		number
	sender: string
	senderId: number
	msg: string
	type: string
}

interface MessageProps {
	message: Message
}

declare module '@mui/material/styles' {
	interface Palette {
		ochre: Palette['primary'];
	}

	interface PaletteOptions {
		ochre?: PaletteOptions['primary'];
	}
}

// Update the Button's color options to include an ochre option
declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		ochre: true;
	}
}

const theme = createTheme({
	palette: {
		ochre: {
			main: '#ffc107'
		},
	},

	typography: {
		fontFamily: "azonix"
	}
});

const MessageChat: React.FC<MessageProps> = ({ message }) => {

	const { userData } = useUser();
	const [cookies] = useCookies(["access_token"]);

	const navTo = useNavigate();
	const changetogamefriend = (id:string) => {
		navTo("/gamefriend?id=" + id)
	}

	const handleRefuseClick = () => {
		const req = new Request("http://" + process.env.REACT_APP_HOSTNAME + ":3000/chat/gameinvite/refuser/" + message.id, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			},
		})
		fetch(req)
			.then((response) => {
				socket.emit('update')
			})
			.catch((error) => {
				
			});
	}

	const handleAccepterClick = () => {
		const req = new Request("http://" + process.env.REACT_APP_HOSTNAME + ":3000/chat/gameinvite/accepter/" + message.id, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			},
		})
		fetch(req)
			.then((response) => {
				socket.emit('accepterinvgame', message.id)
				changetogamefriend((message.senderId).toString())
			})
			.catch((error) => {
				
			});
	}
	if (message.type === "MESSAGE") {
		return (
			<span><b>{message.sender + ":"}</b><br></br>{message.msg}</span>
		)
	}
	else {
		if (message.sender === userData.name) {
			return (
				<span><b>{message.sender + ":"}</b><br></br>{message.msg}</span>
			)
		}
		else {
			return (
				<span><b>{message.sender + ":"}</b><br></br>{message.msg}
					<br></br>
					<div className='chat-btn-pos'>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'flex-start',
							}}
						>
							<ThemeProvider theme={theme}>

								<ButtonGroup
									variant="outlined"
									aria-label="outlined button group">
									<Button
										size='small'
										color='ochre'
										onClick={handleAccepterClick}
									>
										Accept
									</Button>
									<Button
										size='small'
										color='ochre'
										onClick={handleRefuseClick}
									>
										Refuse
									</Button>
								</ButtonGroup>
							</ThemeProvider>
						</Box >
					</div>
				</span>
			)
		}
	}
}

export default MessageChat;