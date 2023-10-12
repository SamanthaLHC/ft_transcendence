import React from 'react'
import ducky from '../../assets/fire.gif'
import Header from '../header/Header'
import Friends from '../friends/Friends'

const Game: React.FC = () => {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='content-page'>
					<div className='image-center'>
						<h2> game page</h2>
						<img src={ducky} alt='lol'>
						</img>
					</div>
				</div>
			</div>
		</React.Fragment>

	)
}

export default Game;