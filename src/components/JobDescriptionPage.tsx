import { Paper, Typography, Box, Button } from "@mui/material";

interface JobDescriptionPageProps {
  onNext: () => void;
  onBack: () => void;
}

function JobDescriptionPage({ onNext, onBack }: JobDescriptionPageProps) {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Step 2: Job Description
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Enter the job description to personalize your application
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Job description input will be implemented here
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext}>
          Next
        </Button>
      </Box>
    </Paper>
  );
}

export default JobDescriptionPage;

