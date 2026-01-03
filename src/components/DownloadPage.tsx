import { Paper, Typography, Box, Button } from "@mui/material";

interface DownloadPageProps {
  onBack: () => void;
}

function DownloadPage({ onBack }: DownloadPageProps) {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Step 3: Download CV/Resume
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Download your personalized CV and cover letter
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Download interface will be implemented here
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
      </Box>
    </Paper>
  );
}

export default DownloadPage;

