import React from 'react'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import MatchHistory from './MatchHistory'
import Ranking from './Ranking'
import WinsAndLoses from './WinsAndLoses'

const Profil: React.FC = () => {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='content-profile'>
					<div className='first-row'>
						<WinsAndLoses />
					</div>
					<div className='second-row'>
						<div className='section-items'>
							<Ranking />
						</div>
						<div className='section-items'>
							<MatchHistory />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default Profil;