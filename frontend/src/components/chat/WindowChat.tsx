import React from 'react'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import Channels from './Channels'
import { Divider } from '@mui/material'

const WindowChat: React.FC = () => {

	return (
		<div className='chat-content'>
			{/* the big window */}
			<div className='chat-header'>
				{/* en tete avec tite du chan */}
				{/* titre du chan don'kmow if necessary */}
			</div>
			<div className='messages-area'>
				{/* the conv space */}
			</div>
			<form className='' >
				<textarea> .. </textarea>
			</form>
		</div>

	)
}

export default WindowChat;

//HERE set de faux users et un lorem ipsum pour voir le rendu du chan