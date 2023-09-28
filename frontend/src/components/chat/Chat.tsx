import React from 'react'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import Channels from './Channels'
import { Divider } from '@mui/material'

const Chat: React.FC = () => {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<Divider>
					<Channels />
				</Divider>
			</div>
		</React.Fragment>

	)
}

export default Chat;