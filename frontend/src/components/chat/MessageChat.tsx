import React, { useState, useEffect, useRef } from 'react'

interface Message {
	sender: string
	msg: string
}

interface TypedMessage {
	message: Message
	type: string
}

interface MessageProps {
	typedMessage: TypedMessage
}

const MessageChat: React.FC<MessageProps> = ({ typedMessage }) => {
	
	if (typedMessage.type === "GAME") {
		return (
			<span><b>{typedMessage.message.sender + ":"}</b><br></br>{typedMessage.message.msg}
				<br></br>
					<div className='btn-pos'>
						<button className="btn-size" >Accept</button>
						<button className="btn-size" >Refuse</button>
					</div>
			</span>
		)
	} else {
		return (
			<span><b>{typedMessage.message.sender + ":"}</b><br></br>{typedMessage.message.msg}
			</span>
		)

	}
}

export default MessageChat;