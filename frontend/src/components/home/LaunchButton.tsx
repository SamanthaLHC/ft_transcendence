import coin from '../../assets/duck_in_lake.png'



export default function LauncButton() {
	return (
			<div className='launch-game'
			style={{ backgroundImage: `url(${coin})` }} >
				<button>
					Play this magical game, right now !
				</button>
			</div>	

	);
}