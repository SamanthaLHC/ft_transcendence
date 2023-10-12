import React from 'react'
import Header from '../header/Header'
import Friends from '../friends/Friends'
import MatchHistory from './MatchHistory'
import Ranking from './Ranking'

const Profil: React.FC = () => {

	return (
		<React.Fragment>
			<Header />
			<div id="container">
				<Friends />
				<div className='content-page'>
					<div className='list-items'>
						<Ranking />
					</div>
					<div className='list-items'>
						<MatchHistory />
					</div>
				</div>
			</div>
		</React.Fragment>

	)
}

export default Profil;