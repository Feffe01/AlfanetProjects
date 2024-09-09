import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
//mui materials
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
//mui icons
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutButton from './buttons/LogoutButton';
import SwitchThemeButton from './buttons/SwitchThemeButton';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';

const drawerWidth = 240;

const listItems = [
	{
		id: 0 as number,
		label: 'Turni',
		icon: <DateRangeRoundedIcon />,
		path: '/turni',
	},
	{
		id: 1,
		label: 'Statistiche',
		icon: <EqualizerIcon />,
		path: '/grafico',
	},
	{
		id: 2,
		label: 'Timbrature',
		icon: <AssignmentTurnedInRoundedIcon />,
		path: '/timbrature',
	},
	{
		id: 3,
		label: 'Assenze',
		icon: <EventBusyRoundedIcon />,
		path: '/assenze',
	},
	{
		id: 4,
		label: 'Notifiche',
		icon: <NotificationsRoundedIcon />,
		path: '/notifiche',
	},
	{
		id: 5,
		label: 'Bustepaga',
		icon: <DescriptionRoundedIcon />,
		path: '/bustepaga',
	},
];

const MyList = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 25,
    paddingRight: 25,
    gap: 25,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 30,
  },
  '& .MuiListItemText-primary': {
    fontSize: 25,
  },
	overflow: 'hidden',
});

function Layout() {
  const [selectedListItem, setSelectedListItem] = useState<number|undefined>(0);
  const reducingValue = 160;
  const [drawerReducer, setDrawerReducer] = useState<number>(reducingValue);
	const navigate = useNavigate();

  const handleListItemClick = (
    // event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		path: string,
    index?: number,
  ) => {
    setSelectedListItem(index);
		navigate(path);
		setDrawerReducer(reducingValue);
  };

	const getProfilePicture = () => {
		const pp = localStorage.getItem('profilePicture') || '';

		return `data:image/png;base64,${pp}`
	}
	
	const getUserName = () => {
		const name = localStorage.getItem('name') || '';
		const surname = localStorage.getItem('surname') || '';

		return name + ' ' + surname;
	}

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
					<Tooltip title={drawerReducer === reducingValue ? "Menù" : "Riduci Menù"}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={()=>{setDrawerReducer(drawerReducer === 0 ? reducingValue : 0);}}
							sx={{ mr: 2, }}
						>
							{drawerReducer === reducingValue ? <MenuIcon sx={{fontSize: 30}}/> : <ArrowBackIcon sx={{fontSize: 30}}/>}
						</IconButton>
					</Tooltip>

          <Typography variant="h5" noWrap component="div" flex={1}>
            Gestione Personale
          </Typography>

					<Tooltip title="Profilo">
						<IconButton onClick={() => handleListItemClick('/profilo')} size='small' sx={{p: 1}}>
							<Typography color={'white'} mr={1}>{getUserName()}</Typography>
							<Avatar alt="Remy Sharp" src={getProfilePicture()}/>
						</IconButton>
					</Tooltip>

					<LogoutButton size="large" />

					<SwitchThemeButton />
        </Toolbar>
      </AppBar>
			
      <Drawer
      	variant='permanent'
      	anchor='left'
        sx={{
          width: drawerWidth - drawerReducer,
          transition: 'width 0.3s ease',
          [`& .MuiDrawer-paper`]: { width: drawerWidth - drawerReducer, boxSizing: 'border-box', transition: 'width 0.3s ease',},
        }}
      >
      	<Toolbar />
        <MyList>
          {listItems.map(item => {
            return (
							<Tooltip title={item.label} placement='right'>
								<ListItemButton
									key={item.id}
									selected={selectedListItem === item.id}
									// onClick={(event) => handleListItemClick(event, item.id)}
									onClick={() => handleListItemClick(item.path, item.id)}
									alignItems="flex-start"
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText
										primary={item.label}
									/>
								</ListItemButton>
							</Tooltip>
            )
          })}
        </MyList>
      </Drawer>
			
			<Box
				display='flex'
				flexDirection='column'
				height='100vh'
				width={`calc(100vw - ${drawerWidth}px + ${drawerReducer}px)`}
				margin='auto'
				alignItems='center'
			>
				<Toolbar />
				<Box
					flexGrow={1}
					display='flex'
					alignItems='center'
					justifyContent="center"
					width={"100%"}
				>
					<Outlet />
				</Box>
			</Box>
    </Box>
  );
}

export default Layout;