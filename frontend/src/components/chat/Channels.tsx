import * as React from 'react';
import SearchBar from '../friends/SearchBar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from '@mui/material';
import { Divider } from '@mui/material';


interface Channel {
	name: string;
  }


 const Channels: React.FC = () => {

    const chan: Channel[] = [
        {
            'name': "chan 1",
        },
        {
            'name': "chan 2",
        },
        {
            'name': "chan 3",
        },

    ];

    return (
        <React.Fragment>
            <div
                className='channels'>
                <h5 className='typo-channel yellow'>
                    Channels
                    <IconButton className='add-button'>
                        <AddCircleIcon />
                    </IconButton>
                </h5>
                <SearchBar />
                <div>
                    <ul className='typo yellow list'>
                        {chan.map(((channel) => (
                            <ListItem className='yellow' key={channel.name}>
                                <button className='profil-button'>
                                    <Divider>
                                        <ListItemText />
                                        {channel.name}
                                    </Divider>
                                </button>
                            </ListItem>
                        )))}
                    </ul>
                </div>
            </div>
        </React.Fragment >
    );
}
export default Channels;