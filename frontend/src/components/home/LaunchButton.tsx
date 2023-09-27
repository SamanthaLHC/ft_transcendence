import coin from '../../assets/duck_in_lake.png'
import { useNavigate } from 'react-router';



export default function LauncButton() {
	let navToGame = useNavigate();
	const changeToGame = () => {
		let pathGame = '/game';
		navToGame(pathGame);
	}
	return (
			<div className='launch-game'
			style={{ backgroundImage: `url(${coin})` }} >
				<button onClick={changeToGame}>
					Play this magical game, right now !
				</button>
			</div>	
	);
}