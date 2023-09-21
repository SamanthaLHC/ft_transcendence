import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

export default function ProfilSpace() {
    return (
        <Stack direction="row" spacing={2}>
            <Avatar alt="profil picture" src="../../assets/giant-rubber-duck.jpg" />
            <Typography
                color={"beige"}
            >
                coin-coin
            </Typography>
        </Stack>
    );
}


// TODO redirect rpofil page