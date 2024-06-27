import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
//mui materials
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
//mui icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const drawerWidth = 240;
const listItems = [
{
  id: 0,
  label: 'Homepage',
  icon: <HomeRoundedIcon />,
},
{
  id: 1,
  label: 'Timbrature',
  icon: <AssignmentTurnedInRoundedIcon />,
},
{
  id: 2,
  label: 'Assenze',
  icon: <EventBusyRoundedIcon />,
},
{
  id: 3,
  label: 'Notifiche',
  icon: <NotificationsRoundedIcon />,
},
{
  id: 4,
  label: 'Bustepaga',
  icon: <DescriptionRoundedIcon />,
},
{
  id: 5,
  label: 'Profilo',
  icon: <PersonRoundedIcon />,
},
{
  id: 6,
  label: 'Cambio Password',
  icon: <KeyRoundedIcon />,
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
});

function Layout() {
  const [selectedListItem, setSelectedListItem] = useState<number>(0);
  const [drawerReducer, setDrawerReducer] = useState<number>(0);
  const reducingValue = 160;

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedListItem(index);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={()=>{setDrawerReducer(drawerReducer === 0 ? reducingValue : 0);}}
            sx={{ mr: 2, }}
          >
            {drawerReducer === reducingValue ? <MenuIcon sx={{fontSize: 30}}/> : <ArrowBackIcon sx={{fontSize: 30}}/>}
          </IconButton>
          <Typography variant="h5" noWrap component="div">
            Gestione Personale
          </Typography>
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
              <ListItemButton
                selected={selectedListItem === item.id}
                onClick={(event) => handleListItemClick(event, item.id)}
                alignItems="flex-start"
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                />
              </ListItemButton>
            )
          })}
        </MyList>
      </Drawer>
      <hr />
      <Outlet />
    </Box>
  );
}

export default Layout;