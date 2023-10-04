import React from 'react'
import Header from '../header/Header'
import Friends from '../friends/Friends'

const Settings: React.FC = () => {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div id='settings-content'>
					<div className='list-items'>
						<div className='change-name'>
							<h3 className='typo yellow'> Change your name: </h3>
							<textarea />
						</div>
						<button  >Activate 2fa</button>
						<div>
							<button  >game option 1</button>
							<button  >game option 2</button>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment >
	)
}

export default Settings;