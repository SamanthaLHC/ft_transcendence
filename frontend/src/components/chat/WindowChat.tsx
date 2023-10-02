// import React, { useState, useEffect } from 'react'



const WindowChat: React.FC = () => {

	return (
		<div className='chat-content'> {/* the big window */}
			<div className='chat-header'> {/* en tete avec tite du chan */}
				Chan name (wip)
			</div>
			<div className='messages-area'>	{/* the conv space */}
				<ul>
					{/* here, the messages sent */}
				</ul>
			</div>
			<div>
				<textarea />
			</div>
			<button> SEND </button>
		</div>
	)
}

export default WindowChat;

//HERE set de faux users et un lorem ipsum pour voir le rendu du chan