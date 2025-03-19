import react, { useState, useEffect } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GridViewIcon from '@mui/icons-material/GridView';
import Grid from '@mui/material/Grid2';
import { Slot } from 'expo-router';

export default function PageLayout() {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (window.location.pathname === '/page/video') {
            setValue(0);
        }
        if (window.location.pathname === '/page/records') {
            setValue(1);
        }
        if (window.location.pathname === '/page/profile') {
            setValue(2);
        }
    }, []);

    const handleBottomNavigationChange = (_event: any, newValue: number) => {
        if (newValue === 0) {
            window.location.href = '/page/video';
        }
        if (newValue === 1) {
            window.location.href = '/page/records';
        }
        if (newValue === 2) {
            window.location.href = '/page/profile';
        }
    };
    return (
        <Grid container direction="column" spacing={5} height={'100vh'}  sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <Grid overflow={'scroll'} size='auto'>
                <Slot />
            </Grid>
            
            <Grid width={'100%'} >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={handleBottomNavigationChange}
                >
                    <BottomNavigationAction label="Video" icon={<AddCircleIcon />} />
                    <BottomNavigationAction label="Records" icon={<GridViewIcon />} />
                    <BottomNavigationAction label="Profile" icon={<AccountBoxIcon />} />
                </BottomNavigation>
            </Grid>
        </Grid>
    );
}