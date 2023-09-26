import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';


export default function SettingsButton() {
	return (

		<IconButton style={{ color: '#ffc107' }}>
			<SettingsIcon
				display={"flex-end"}
			/>
		</IconButton>
	);
}

//TODO menu déroulant: 
//TODO switch pour activer 2fa
//TODO edit pour changer name et pp