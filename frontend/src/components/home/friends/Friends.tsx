import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import rubber from '../../../assets/Rubber_Duck_in_Parramatta_Park.jpg'
import SearchBar from './SearchBar';

//TODO search bar
//TODO list avatar + name
//TODO selection highlight with mouse
//TODO connexion light (red or green)

//TODO voir rubrique avatar with badge material ui


//HERE get id 

//HERE et name from back

// HERE get photo


//TODO prendra en param une list desdatas des users 
// faire une loop pour afficher
//TODO deuxieme param filter, (if filter === null || user.name.contains(filter))
//condition pour affficher l'user

export default function Friends() {
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
                                    <Avatar alt="Profile Picture" src={rubber} />
                                </ListItemAvatar>
                                <ListItemText />
                                {user.name}
                            </ListItem>
                        )))}
                        </ul>
                    </React.Fragment>
                </div>
            </div>
        </React.Fragment >
    );
}

//TODO on click friends: ajouter les options 
//TODO ajouter la diode de connexion