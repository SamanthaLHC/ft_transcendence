import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router';
import Avatar from '@mui/material/Avatar';
import rubber from '../../assets/duck_in_lake.png'
import SearchBar from './SearchBar';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

interface User {
	name: string;
	id: number;
	photo: string;
  }

const Friends: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [cookies] = useCookies(["access_token"]);
	let navToFriendProfil = useNavigate();
	const changeToFriendProfil = () => {
		let pathFriendProfil = '/friend';
		navToFriendProfil(pathFriendProfil);
	}
	useEffect(() => {
		async function getFriend(): Promise<void> {
			const req = new Request('http://localhost:3000/users/get_friend', {
					method: "GET",
					headers: {
						"Authorization": `Bearer ${cookies.access_token}`,
					},
				});
				try {
					const response = await fetch(req);
					const datas = await response.json();
					if (datas) {
						let usersData: User[] = []
						let i = 0
						while(datas[i])
						{
							usersData.push({name: datas[i].target.name, id: datas[i].target.id, photo: datas[i].target.photo})
							i++
						}
						setUsers(usersData)
					}
				} catch (error) {
					
				}
			}
		getFriend()
	}, [cookies.access_token]);
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
											<Avatar alt="Profile Picture" src={user.photo} />
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