// import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

interface SearchBarProps {
	onSearchChange: (query: string) => void;
	updateUsers: (dummyState: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange, updateUsers }) => {
	const [searchText, setSearchText] = useState('');

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setSearchText(value);
		onSearchChange(value);
	};
	
	const handleClick = () => {
		onSearchChange(searchText);
		updateUsers(true);
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
							onClick={handleClick}
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

// TODO gerer les query pour les recherches