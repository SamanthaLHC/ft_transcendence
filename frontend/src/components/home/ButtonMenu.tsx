import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";



export default function ButtonMenu() {
	return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'flex-start',
				}}
			>
				<ButtonGroup
					variant="outlined"
					aria-label="outlined button group"
				>
					<Button>Chat</Button>
					<Button>Game</Button>
				</ButtonGroup>

			</Box>
	);
}