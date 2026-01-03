import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { UserProfile } from "../types/profile";
import ProfileDisplay from "./ProfileDisplay";

interface ProfilePageProps {
  onNext: () => void;
}

function ProfilePage({ onNext }: ProfilePageProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if profile exists
      const exists = await invoke<boolean>("profile_exists");
      
      if (exists) {
        // Load existing profile
        const profileJson = await invoke<string>("load_profile", { path: null });
        const parsedProfile = JSON.parse(profileJson) as UserProfile;
        setProfile(parsedProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error checking profile:", err);
      setError("Failed to check for existing profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUseProfile = () => {
    // Skip to next step if user wants to use existing profile
    onNext();
  };

  const handleUpdateProfile = () => {
    // Show upload UI for updating
    setIsUpdating(true);
    setProfile(null);
  };

  const handleCancelUpdate = () => {
    // Cancel update and show existing profile again
    setIsUpdating(false);
    checkProfile();
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Checking for existing profile...
        </Typography>
      </Paper>
    );
  }

  // If profile exists and not updating, show existing profile
  if (profile && !isUpdating) {
    return (
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Step 1: User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your existing profile has been loaded
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          You have an existing profile. You can use it or update it with new documents.
        </Alert>

        <Divider sx={{ my: 4 }} />

        {/* Display Existing Profile */}
        <Box sx={{ mb: 4 }}>
          <ProfileDisplay profile={profile} />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
          <Button variant="outlined" onClick={handleUpdateProfile}>
            Update Profile
          </Button>
          <Button variant="contained" onClick={handleUseProfile}>
            Use this Profile
          </Button>
        </Box>
      </Paper>
    );
  }

  // No profile exists or user is updating - show upload UI
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Step 1: User Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {isUpdating
          ? "Upload new documents to update your profile"
          : "Upload your documents to build your profile"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isUpdating && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Updating your profile will replace the existing one.
        </Alert>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Document Upload Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Upload Documents
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Upload your CV, project descriptions, and other relevant documents
        </Typography>
        <Box
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            mt: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Document upload area will be implemented here
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Profile Information Display Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Profile Information
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Your extracted profile information will appear here
        </Typography>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            mt: 2,
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Profile information will be displayed here after extraction
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
        {isUpdating && (
          <Button variant="outlined" onClick={handleCancelUpdate}>
            Cancel
          </Button>
        )}
        <Button variant="contained" onClick={onNext} disabled>
          Next: Job Description
        </Button>
      </Box>
    </Paper>
  );
}

export default ProfilePage;

