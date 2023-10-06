import coin from '../../assets/duck_in_lake.png'
import { useNavigate } from 'react-router';



const LauncButton: React.FC = () => {

	const navToGame = useNavigate();
	const changeToGame = () => {
		let pathGame: string = '/game';
		navToGame(pathGame);
	}
	return (
		<div className='launch-game'
			style={{ backgroundImage: `url(${coin})` }} >
			<button className='launch-button' onClick={changeToGame}>
				Play this magical game, right now !
			</button>
		</div>
	);
}

export default LauncButton;