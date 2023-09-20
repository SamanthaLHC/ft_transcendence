import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { styled, alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
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
                sx={{ maxWidth: 200, height: 500, backgroundColor: "#282c34" }}
            >
                <Typography
                    variant="h5" sx={{ p: 2, pb: 0 }}
                    // sx={{color: '#ffc107'}}
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