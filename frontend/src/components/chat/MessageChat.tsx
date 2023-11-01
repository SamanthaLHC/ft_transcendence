import React, { useState, useEffect, useRef } from 'react'

interface Message {
	sender: string
	msg: string
}

interface MessageProps {
	message: Message
	type: string
}

const MessageChat: React.FC<MessageProps> = ({ message, type }) => {

	return (
		<span><b>{message.sender + ":"}</b><br></br>{message.msg}</span>
	)
}

export default MessageChat;