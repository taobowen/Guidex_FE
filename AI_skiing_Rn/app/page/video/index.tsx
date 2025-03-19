import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputFileUpload from './components/FileUpload';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export default function VideoUpload(props: { disableCustomTheme?: boolean }) {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files);
    }
    const handleGenerateSuggestion = () => {
        window.location.href = '/page/evaluation';
    }
    return (
        <Grid
            container
            direction="column"
            spacing={5}
            sx={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Grid>
                <Alert severity="info">This is an info Alert.</Alert>
            </Grid>
            <Grid>
                <h1>Upload Video</h1>
            </Grid>
            <Grid>
                <InputFileUpload onChange={handleFileUpload} />
            </Grid>
            <Grid>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Video Requirements
                        </Typography>
                        <Typography variant="body2">
                            1. Format: mp4<br />
                            2. You must be clearly visible in the video
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid>
                <Button startIcon={<ArrowCircleRightIcon />} variant="contained" color="success" fullWidth sx={{ mt: 2 }} size='large' onClick={handleGenerateSuggestion}>
                    Analyze Video
                </Button>
            </Grid>
        </Grid>
    )
}