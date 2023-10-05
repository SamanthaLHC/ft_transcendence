import React from 'react'
import ducky from '../../assets/duck-no.gif'
import Header from '../header/Header'
import Friends from '../friends/Friends'

const Profil: React.FC = () => {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='image-center'>
					<h2> /!\ -- Friend PAGE -- under construction /!\ </h2>
					<img src={ducky} alt='lol'></img>
				</div>
			</div>
		</React.Fragment>

	)
}
export default Profil;
