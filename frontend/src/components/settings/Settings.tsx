import React from 'react'
import ducky from '../../assets/duck_worker.png'
import Header from '../header/Header'
import Friends from '../friends/Friends'

const Settings: React.FC = () => {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='image-center'>

					<h2> /!\ --SETTINGS-- PAGE UNDER CONSTRUCTION /!\ </h2>
					<img src={ducky} alt='lol'>
					</img>
				</div>
			</div>
		</React.Fragment>
	)
}

export default Settings;