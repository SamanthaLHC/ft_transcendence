import { Box, Button, ButtonGroup, createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import { useUser } from '../Context'

interface Message {
	sender: string
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
	console.log("mess type ", message.type)
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
					<div className='btn-pos'>
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
									>
										Accept
									</Button>
									<Button
										size='small'
										color='ochre'
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