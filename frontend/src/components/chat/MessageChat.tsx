import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../Context'

interface Message {
	sender: string
	msg: string
	type: string
}

interface MessageProps {
	message: Message
}

const MessageChat: React.FC<MessageProps> = ({ message }) => {

	const { userData } = useUser();
	console.log("mess type ",message.type)
	if (message.type === "MESSAGE") {
		return (
			<span><b>{message.sender + ":"}</b><br></br>{message.msg}</span>
		)
	}
	else {
		if (message.sender === userData.name)
		{
			return (
				<span><b>{message.sender + ":"}</b><br></br>{message.msg}</span>
			)
		}
		else
		{
		return (
			<span><b>{message.sender + ":"}</b><br></br>{message.msg}<button className=""> ACCEPTER </button></span>
		)
		}
	}
}

export default MessageChat;