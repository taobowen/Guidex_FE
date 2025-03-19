import React from "react";
import { Avatar, Box, Button, Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const ProfilePage = () => {
  return (
    <Grid
        container
        direction={"column"}
      sx={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: "80vh",
      }}
    >
        <Grid>
        <Card sx={{ width: 350, p: 3, textAlign: "center", borderRadius: 3 }}>
        {/* Avatar */}
        <Avatar
          src="https://via.placeholder.com/150"
          alt="Profile Picture"
          sx={{ width: 100, height: 100, margin: "0 auto" }}
        />

        {/* User Details */}
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            John Doe
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Age: 28
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Sex: Male
          </Typography>
        </CardContent>

        {/* Logout Button */}
      
      </Card>
        </Grid>
      
      <Grid>
        <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
            Log Out
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
