import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useCookies } from 'react-cookie';

// function Search() {
// 	const [searchText, setSearchText] = useState('');


// const handleSearch = () => {
// 	// Implement your search logic here
// 	console.log(`Searching for: ${searchText}`);
// };

interface Channel {
	name: string;
}

interface SearchBarProps {
	setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setChannels }) => {
	const [searchText, setSearchText] = useState('');
	const [cookies] = useCookies(["access_token"]);

	const handleSearch = async (searchText: string) => {
		setSearchText(searchText);
		console.log(`Searching for: ${searchText}`);

		let uri_str: string
		if (searchText === '')
			uri_str = 'http://localhost:3000/chat/channels/joined'
		else 
			uri_str = 'http://localhost:3000/chat/channel?search=' + searchText

		const req = new Request(uri_str, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			},
		});

		try {
			const response = await fetch(req);
			const data = await response.json();
			console.log(data);

			const fetchedChannels = data.map((item: any) => {
				console.log(item);
				return { name: item.name };
			});

			setChannels(fetchedChannels);  // Mettez à jour les canaux ici
		} catch (error) {
			console.error("Error fetching channels:", error);
		}
	};

	return (
		<div>
			<TextField
				label="Search"
				variant="outlined"
				fullWidth
				value={searchText}
				onChange={(e) => handleSearch(e.target.value)}
				style={{ backgroundColor: '#42464f' }}
				InputProps={{
					style: { color: '#ffc107' }, // Set la couleur du texte à #ffc107 (jaune)
					endAdornment: (
						<IconButton
							style={{ color: '#ffc107' }}
							onClick={() => handleSearch(searchText)}  // Pass the searchText when clicking the search icon
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