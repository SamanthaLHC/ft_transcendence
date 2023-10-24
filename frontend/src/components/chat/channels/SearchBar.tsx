import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
	onSearchChange: (query: string) => void;
	updateChannels: (dummyState: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange, updateChannels }) => {
	const [searchText, setSearchText] = useState('');

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setSearchText(value);
		onSearchChange(value);
	};
	
	const handleClick = () => {
		onSearchChange(searchText);
		updateChannels(true);
	}

	return (
		<div>
			<TextField
				label="Search"
				variant="outlined"
				fullWidth
				value={searchText}
				onChange={handleSearchChange}
				style={{ backgroundColor: '#42464f' }}
				InputProps={{
					style: { color: '#ffc107' }, // Set la couleur du texte à #ffc107 (jaune)
					endAdornment: (
						<IconButton
							style={{ color: '#ffc107' }}
							onClick={() => handleClick()}  // Pass the searchText when clicking the search icon
						>
							<SearchIcon />
						</IconButton>
					),
				}}
			/>
		</div>
	);
}

export default SearchBar;