import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import { UserProfile } from "../types/profile";

interface ProfileDisplayProps {
  profile: UserProfile;
}

function ProfileDisplay({ profile }: ProfileDisplayProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Personal Information */}
      {profile.personalInfo && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {profile.personalInfo.name && (
              <Typography variant="body1">
                <strong>Name:</strong> {profile.personalInfo.name}
              </Typography>
            )}
            {profile.personalInfo.email && (
              <Typography variant="body1">
                <strong>Email:</strong> {profile.personalInfo.email}
              </Typography>
            )}
            {profile.personalInfo.phone && (
              <Typography variant="body1">
                <strong>Phone:</strong> {profile.personalInfo.phone}
              </Typography>
            )}
            {profile.personalInfo.location && (
              <Typography variant="body1">
                <strong>Location:</strong> {profile.personalInfo.location}
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {/* Work Experience */}
      {profile.workExperience && profile.workExperience.length > 0 && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Work Experience
          </Typography>
          <List>
            {profile.workExperience.map((exp, index) => (
              <ListItem key={index} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {exp.role} at {exp.company}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {exp.duration}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {exp.description}
                      </Typography>
                    </Box>
                  }
                />
                {index < profile.workExperience.length - 1 && <Divider sx={{ width: "100%", mt: 2 }} />}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          <List>
            {profile.education.map((edu, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {edu.degree}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {edu.institution}
                      {edu.year && ` • ${edu.year}`}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {profile.skills.map((skill, index) => (
              <Chip key={index} label={skill} size="small" />
            ))}
          </Box>
        </Paper>
      )}

      {/* Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Projects
          </Typography>
          <List>
            {profile.projects.map((project, index) => (
              <ListItem key={index} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {project.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {project.description}
                      </Typography>
                      {project.technologies && project.technologies.length > 0 && (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                          {project.technologies.map((tech, techIndex) => (
                            <Chip
                              key={techIndex}
                              label={tech}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  }
                />
                {index < profile.projects.length - 1 && <Divider sx={{ width: "100%", mt: 2 }} />}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* About Me */}
      {profile.aboutMe && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            About Me
          </Typography>
          <Typography variant="body2">{profile.aboutMe}</Typography>
        </Paper>
      )}

      {/* Certifications */}
      {profile.certifications && profile.certifications.length > 0 && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Certifications
          </Typography>
          <List>
            {profile.certifications.map((cert, index) => (
              <ListItem key={index}>
                <ListItemText primary={cert} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default ProfileDisplay;

