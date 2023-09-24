import React from 'react'
import ducky from '../../assets/under_construction.png'
import Header from '../header/Header'
import Friends from '../friends/Friends'

export default function Game() {

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
