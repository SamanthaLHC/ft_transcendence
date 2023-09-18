import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';


export default function SettingsButton() {
	return (

		<IconButton>
			<SettingsIcon
				style={{ color: '#ffc107' }}
				display={"flex-end"}
			/>
		</IconButton>
	);
}