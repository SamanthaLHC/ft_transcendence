import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function Search() {
    const [searchText, setSearchText] = useState('');

    // const handleSearchChange = (e) => {
    //     setSearchText(e.target.value);
};

const handleSearch = () => {
    // Implement your search logic here
    // console.log(`Searching for: ${searchText}`);
};


export default function SearchBar() {

    return (
        <div>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                // value={searchText}
                // onChange={handleSearchChange}
                InputProps={{
                    style: { color: '#ffc107' }, // Set the background color to #ffc107 (yellow)
                    endAdornment: (
                        <IconButton 
                        style={{ color: '#ffc107' }}
                        onClick={handleSearch}
                        >
                            <SearchIcon />
                        </IconButton>
                    ),
                }}
            />
        </div>
    );

}


// TODO gerer les query pour les recherches