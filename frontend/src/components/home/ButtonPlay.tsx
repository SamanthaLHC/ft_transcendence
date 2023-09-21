import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import coin from '../../assets/Rubber_Duck_in_Parramatta_Park.jpg'

const images = [
	{
		url: coin,
		title: 'Play this magical game, right now!',
		width: '100%',
	},
]


const ImageButton = styled(ButtonBase)(({ theme }) => ({
	position: 'relative',
	height: 450,
	[theme.breakpoints.down('sm')]: {
		width: '100% !important', // Overrides inline-style
		height: 100,
	},
	'&:hover, &.Mui-focusVisible': {
		zIndex: 1,
		'& .MuiImageBackdrop-root': {
			opacity: 0.15,
		},
		'& .MuiImageMarked-root': {
			opacity: 0,
		},
		'& .MuiTypography-root': {
			border: '4px solid currentColor',
		},
	},
}));

const ImageSrc = styled('span')({
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundSize: 'cover',
	backgroundPosition: 'center 100%',
});

const Image = styled('span')(({ theme }) => ({
	position: 'absolute',
	left: 20,
	right: 20,
	top: 0,
	bottom: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundColor: theme.palette.common.black,
	opacity: 0.4,
	transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
	height: 3,
	width: 18,
	backgroundColor: theme.palette.common.white,
	position: 'absolute',
	bottom: -2,
	left: 'calc(50% - 9px)',
	transition: theme.transitions.create('opacity'),
}));

export default function ButtonPlay() {
	return (
		<Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 500, width: '100%' }}>
			{images.map((image) => (
				<ImageButton
					focusRipple
					key={image.title}
					style={{
						width: image.width,
					}}
				>
					<ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
					<ImageBackdrop className="MuiImageBackdrop-root" />
					<Image>
						<Typography
							component="span"
							variant="subtitle1"
							color="inherit"
							sx={{
								position: 'relative',
								p: 4,
								pt: 2,
								pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
							}}
						>
							{image.title}
							<ImageMarked className="MuiImageMarked-root" />
						</Typography>
					</Image>
				</ImageButton>
			))}
		</Box>
	);
}

// // Augment the palette to include an ochre color
// declare module '@mui/material/styles' {
// 	interface Palette {
// 		ochre: Palette['primary'];
// 	}

// 	interface PaletteOptions {
// 		ochre?: PaletteOptions['primary'];
// 	}
// }

// // Update the Button's color options to include an ochre option
// declare module '@mui/material/Button' {
// 	interface ButtonPropsColorOverrides {
// 		ochre: true;
// 	}
// }

// const theme = createTheme({
// 	palette: {
// 		ochre: {
// 			main: '#ffc107'
// 		},
// 	},

// 	typography: {
// 		fontFamily: "Azonix"
// 	}
// });


// function ButtonPlay() {
// 	return (


// 		<ThemeProvider theme={theme}>
// 			<Button
// 				sx={{ width: 200, height: 90 }}
// 				variant="contained"
// 				size='large'
// 				color="ochre"
// 			>
// 				Play this magical game, right now!
// 			</Button>
// 		</ThemeProvider >
// 	);
// }

// export default ButtonPlay

