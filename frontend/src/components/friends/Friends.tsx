import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router';
import Avatar from '@mui/material/Avatar';
import rubber from '../../assets/duck_in_lake.png'
import SearchBar from './SearchBar';
import { useEffect, useState, MouseEvent} from 'react';
import { useCookies } from 'react-cookie';
import Statusconnectlist from './Statusconnectlist';

interface User {
	name: string;
	id: number;
	photo: string;
	status: string;
  }

const Friends: React.FC = () => {

	const [users, setUsers] = useState<User[]>([]);
	const [UserCreated, setUserCreated] = useState(false);
	const [cookies] = useCookies(["access_token"]);
	const [searchQuery, setSearchQuery] = useState("");
	let navToFriendProfil = useNavigate();

	const changeToFriendProfil = (id:number) => {
		let pathFriendProfil = '/friend?id=' + id;
		navToFriendProfil(pathFriendProfil);
	}

	const handleclick = async (e: MouseEvent, id:number) => {
		changeToFriendProfil(id)
	}

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
	};

	const handleUpdateUsers = () => {
		setUserCreated(true);
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
							usersData.push({name: datas[i].target.name, id: datas[i].target.id, photo: datas[i].target.photo, status: datas[i].target.status})
							i++
						}
						setUsers(usersData)
					}
				} catch (error) {
					
				}
			}
			async function getUsers() {
				console.log("getUsers:", searchQuery);
				let uri_str: string
				uri_str = 'http://localhost:3000/users/search?search=' + searchQuery
				const req = new Request(uri_str, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
					},
				});
	
	
				return fetch(req)
					.then((response) => response.json())
					.then((data) => {
						if (data.statusCode != 404) {
							const fetchedUsers = data.map((item: any) => {
								return { name: item.name, id: item.id, photo: item.photo };
							});
							setUsers(fetchedUsers);
						}
						else
						setUsers([])
					})
					.catch((error) => {
						console.error("Error fetching Users:", error);
					});
			}
			if (searchQuery.length > 0) {
				getUsers();
			}
			else
				getFriend();
	}, [cookies.access_token, searchQuery]);
	//json.parse
	// loop pour afficher listItem
	return (
		<React.Fragment>
			<div
				className='friends'>
				<h5 className='typo-friends yellow'>
					Friends
				</h5>
				<SearchBar onSearchChange={handleSearchChange} updateUsers={handleUpdateUsers}/>
				<div>
					<React.Fragment>
						<ul>
							{users.map(((user) => (
								<ListItem className='yellow' key={user.name}>
									<ListItemAvatar>
										<button className='profil-button' onClick={(event) => handleclick(event, user.id)}>
											<Statusconnectlist photo={user.photo} status={user.status}/>
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