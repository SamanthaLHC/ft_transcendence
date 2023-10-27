import { Avatar, Badge, styled } from "@mui/material";
import play from '../../assets/play.png'
import React from "react";

interface StatusProps {
	photo: string;
	status: string;
}

const Statusconnectlist: React.FC<StatusProps> = ({photo, status}) => {

    const StyledBadgeconnect = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            width: '15px',
            height: '15px',
            borderRadius: '100px',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));

    const StyledBadgedisconnect = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#6F6563',
            color: '#44b700',
            width: '15px',
            height: '15px',
            borderRadius: '100px',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '0%',
                height: '0%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));

    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: '15px',
        height: '15px',
        border: `2px solid ${theme.palette.background.paper}`,
    }));
    if (status == "CONNECTED") {
        return (
            <React.Fragment>
                <StyledBadgeconnect
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot">
                    <Avatar alt="profil picture" src={photo} />
                </StyledBadgeconnect>
            </React.Fragment >

        )
    }
    else if (status == "DISCONNECTED") {
        return (
            <React.Fragment>
                <StyledBadgedisconnect
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot">
                    <Avatar alt="profil picture" src={photo} />
                </StyledBadgedisconnect>
            </React.Fragment >

        )
    }
    else {
        return (
            <React.Fragment>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <SmallAvatar alt="Remy Sharp" src={play} />
                    }
                >
                    <Avatar alt="profil picture" src={photo} />
                </Badge>
            </React.Fragment>
        )
    }
}

export default Statusconnectlist;
