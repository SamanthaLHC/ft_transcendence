import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router';
import SettingsIcon from '@mui/icons-material/Settings';


export default function SettingsButton() {
	
	let navToSettings = useNavigate();
	const changeToSettings = () => {
		let pathSettings = '/settings';
		navToSettings(pathSettings);
	}

	return (

		<IconButton style={{ color: '#ffc107' }}>
			<SettingsIcon
				display={"flex-end"}
				onClick={changeToSettings}
			/>
		</IconButton>
	);
}

//TODO menu déroulant: 
//TODO switch pour activer 2fa
//TODO edit pour changer name et pp