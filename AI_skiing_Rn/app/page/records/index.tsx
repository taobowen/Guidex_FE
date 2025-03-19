import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { Box } from '@mui/material';
import './index.css';

export default function Records() {
   
    return (
        <Grid
            container
            direction="column"
            spacing={5}
            height={'80vh'}
            sx={{
                justifyContent: "center",
                alignItems: "center",
                flexFlow: 'column',
                overflow: 'hidden'
            }}
        >
            <Grid>
                <h1>Consulation Records</h1>
            </Grid>
            <Grid
                sx={{
                    flexShrink: 1,
                    overflow: 'auto',
                }}
            >
                {
                    [0, 1, 2, 3, 4, 5, 6].map((index) => {
                        return (
                            <Card sx={{ minWidth: 275 }} className='card'>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Consulation Record {index}
                                    </Typography>
                                    <Typography variant="body2">
                                        1989年6月4日
                                    </Typography>
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress variant="determinate" value={80} />
                                    </Box>
                                    <Typography variant="body2">
                                        3 issues detected
                                    </Typography>
                                    <Grid direction={'row'} container spacing={2}>
                                        <Button variant="contained" color="info" sx={{ mt: 2 }} size='small'>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="error" sx={{ mt: 2 }} size='small'>
                                            Delete
                                        </Button>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </Grid>
        </Grid>
    )
}