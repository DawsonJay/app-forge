export interface UserProfile {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  workExperience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year?: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;
  aboutMe?: string;
  certifications?: string[];
  // Flexible structure - LLM extracts what's available
}

