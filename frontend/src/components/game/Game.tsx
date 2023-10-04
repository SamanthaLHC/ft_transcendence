import React from 'react'
import ducky from '../../assets/fire.gif'
import Header from '../header/Header'
import Friends from '../friends/Friends'

const Game:React.FC = () => {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='image-center'>
					<h2> /!\ -- GAME -- UNDER CONSTRUCTION /!\ </h2>
					<img src={ducky} alt='lol'>
					</img>
				</div>
			</div>
		</React.Fragment>

	)
}

export default Game;