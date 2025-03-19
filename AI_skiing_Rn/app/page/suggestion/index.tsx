import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Suggestions() {
   
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
                <h1>Detailed Feedback</h1>
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
                                    <Grid container direction={'row'} spacing={2} alignItems='center'>
                                        <Grid>
                                            <img width={200} height={150} src="https://assets.codepen.io/6093409/river.jpg" alt="Profile Picture" />
                                        </Grid>
                                        <Grid>
                                        <Typography variant="body2">
                                            Error: Shoulder Rotation
                                        </Typography>
                                        <Typography variant="body2">
                                            Suggestion: Keep your shoulders parallel to the slope
                                        </Typography>
                                        </Grid>
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