import React from 'react'
import ducky from '../../assets/cute_duck.png'
import Header from '../header/Header'
import Friends from '../friends/Friends'

export default function Profil() {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='image-center'>
					<h2> /!\ -- PROFIL PAGE -- under construction /!\ </h2>
					<img src={ducky} alt='lol'></img>
				</div>
			</div>
		</React.Fragment>

	)
}
