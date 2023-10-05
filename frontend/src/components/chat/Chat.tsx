import React from 'react'
import { Divider } from '@mui/material'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import Channels from './Channels'
import WindowChat from './WindowChat';


const Chat: React.FC = () => {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<Divider>
					<Channels />
				</Divider>
				<WindowChat />
			</div>
		</React.Fragment >

	)
}

export default Chat;