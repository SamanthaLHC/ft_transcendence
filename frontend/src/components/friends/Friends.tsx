import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router';
import Avatar from '@mui/material/Avatar';
import rubber from '../../assets/duck_in_lake.png'
import SearchBar from './SearchBar';


const Friends: React.FC = () => {

	let navToFriendProfil = useNavigate();
	const changeToFriendProfil = () => {
		let pathFriendProfil = '/friend';
		navToFriendProfil(pathFriendProfil);
	}

	const users = [
		{
			'image': "",
			'name': "coin",
		},
		{
			'image': "",
			'name': "pouet",
		},
		{
			'image': "",
			'name': "ducky",
		}, {
			'image': "",
			'name': "yoyo",
		}, {
			'image': "",
			'name': "coucou",
		},
	];

	//json.parse
	// loop pour afficher listItem

	return (
		<React.Fragment>
			<div
				className='friends'>
				<h5 className='typo-friends yellow'>
					Friends
				</h5>
				<SearchBar />
				<div>
					<React.Fragment>
						<ul>
							{users.map(((user) => (
								<ListItem className='yellow' key={user.name}>
									<ListItemAvatar>
										<button className='profil-button' onClick={changeToFriendProfil}>
											<Avatar alt="Profile Picture" src={rubber} />
											<Divider>
												<ListItemText />
												{user.name}
											</Divider>
										</button>
									</ListItemAvatar>
								</ListItem>
							)))}
						</ul>
					</React.Fragment>
				</div>
			</div>
		</React.Fragment >
	);
}

export default 	Friends;


//TODO on click friends: ajouter les options 
//TODO ajouter la diode de connexion
//TODO get friends's pp with fetch get
//TODO get friend profil page  (how ??)