import React from 'react'
import {useState} from 'react'
import Header from '../header/Header'
import Friends from '../friends/Friends'

const Settings: React.FC = () => {

//_____________________handle enable2fa__________________________________________
	const [active2fa, setActive2fa] = useState(false);

	const  handleClick = () => {
		setActive2fa(!active2fa);
	}

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div id='settings-content'>
					<div className='list-items'>
						<div className='change-name'>
							<h3 className='typo-settings'> Change your name: </h3>
							<textarea />
						</div>
						<div className='btn-pos'>
							<button onClick={handleClick}>{ active2fa ? "Disable 2fa" : "Enable 2fa"}</button>
						</div>
						<div className='btn-pos'>
							<button  >game option 1</button>
						</div>
						<div className='btn-pos'>
							<button  >game option 2</button>
						</div>
					</div>
					<div className='item-pos avatar-btn'>
						<button  >Change your avatar</button>
					</div>
				</div>
			</div>
		</React.Fragment >
	)
}

export default Settings;