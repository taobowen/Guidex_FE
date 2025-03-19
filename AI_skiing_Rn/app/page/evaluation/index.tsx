import React, { useRef, MutableRefObject } from 'react';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Button from '@mui/material/Button';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import './index.css';

export default function Evaluation(props: { disableCustomTheme?: boolean }) {
    const [tabValue, setTabValue] = React.useState(0);
    const [activeCard, setActiveCard] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSuggestionDisplay = () => {
        window.location.href = '/page/suggestion';
    }

    const videoRef = useRef<HTMLVideoElement>(null);
    const renderTabContent = () => {
        const handleCardClick = (cardIndex: number) => {
            if (videoRef.current) {
                videoRef.current.currentTime = cardIndex;
                setActiveCard(cardIndex);
            }
        }
        if (tabValue === 0) {
            return (
                <div>
                    {
                        [0, 1, 2, 3, 4, 5, 6].map((index) => {
                            return (
                                <Grid key={`card-${index}`}>
                                    <Card variant="outlined" className={`card ${activeCard === index && 'card-active'}`} onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Typography level="title-md">Error: Shoulder Rotation</Typography>
                                            <Typography>Description of the error.</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                </div>
            )
        } else if (tabValue === 1) {
            return <h1>Edge Transitions</h1>
        }
        else if (tabValue === 2) {
            return <h1>Center of Gravity</h1>
        }
        else if (tabValue === 3) {
            return <h1>Body Coordinatioin</h1>
        }
    }
    return (
        <Grid
            container
            direction="column"
            spacing={1}
            height={'80vh'}
            sx={{
                justifyContent: "flex-start",
                alignItems: "center",
                flexFlow: 'column',
                overflow: 'hidden',
            }}
        >
            <Grid>
                <Alert severity="info">This is an info Alert.</Alert>
            </Grid>
            <Grid>
                <h1>Analysis Screen</h1>
            </Grid>
            <Grid>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="All" />
                    <Tab label="Edge Transitions" />
                    <Tab label="Center of Gravity" />
                    <Tab label="Body Coordinatioin" />
                </Tabs>
            </Grid>
            <Grid>
                <video
                    autoPlay
                    width='500px'
                    muted
                    ref={videoRef}
                    controls
                    poster="https://assets.codepen.io/6093409/river.jpg"
                >
                    <source
                        src="https://assets.codepen.io/6093409/river.mp4"
                        type="video/mp4"
                    />
                </video>
            </Grid>
            <Grid overflow={'auto'} size='auto' sx={{ 
                    flexGrow: 1,
                    flexShrink: 1,
                }}>
                {renderTabContent()}
            </Grid>
            <Grid>
                <Button startIcon={<ArrowCircleRightIcon />} variant="contained" color="success" fullWidth sx={{ mt: 2 }} size='large' onClick={handleSuggestionDisplay}>
                    See Suggestions
                </Button>
            </Grid>
        </Grid>
    )
}