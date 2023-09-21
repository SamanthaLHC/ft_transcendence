import * as React from 'react';
import Card from '@mui/material/Card';
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

export default function Friends() {
    return (
        <React.Fragment>
            <Card
                variant='outlined' 
                sx={{ borderBottom: 4, 
                    borderColor: 'ActiveBorder',  
                    maxWidth: 200,
                    minHeight: '90vh',
                    backgroundColor: "#080d17", 
                    borderRadius: 0 }}
            >
                <Typography
                    variant="h5" sx={{ p: 2, pb: 0, color: '#ffc107'}}
                    color={"burlywood"}
                >
                    Friends
                </Typography>
                <SearchBar />
                <List sx={{ mb: 2 }}>
                    <React.Fragment>
                        <ListItem sx={{ color: '#ffc107' }}>
                            <ListItemAvatar>
                                <Avatar alt="Profile Picture" src={rubber} />
                            </ListItemAvatar>
                            <ListItemText />
                            name
                        </ListItem>
                    </React.Fragment>
                </List>
            </Card>
        </React.Fragment >
    );
}

//TODO on click friends: ajouter les options 
//TODO ajouter la diode de connexion