import React from 'react'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import Channels from './Channels'
import { Divider } from '@mui/material'

export default function Chat() {

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
