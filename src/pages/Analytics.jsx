import {
  Box,
  Typography,
  Paper,
} from "@mui/material";

function Analytics() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Analytics
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Spending analytics and charts will appear here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Analytics;
