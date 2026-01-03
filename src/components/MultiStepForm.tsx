import { useState } from "react";
import { Container, Box } from "@mui/material";
import Breadcrumbs from "./Breadcrumbs";
import ProfilePage from "./ProfilePage";
import JobDescriptionPage from "./JobDescriptionPage";
import DownloadPage from "./DownloadPage";

export type Step = 1 | 2 | 3;

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const handleStepChange = (step: Step) => {
    // Only allow navigation to previous steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfilePage onNext={handleNext} />;
      case 2:
        return <JobDescriptionPage onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <DownloadPage onBack={handleBack} />;
      default:
        return <ProfilePage onNext={handleNext} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs
          currentStep={currentStep}
          onStepClick={handleStepChange}
        />
      </Box>
      <Box>
        {renderStep()}
      </Box>
    </Container>
  );
}

export default MultiStepForm;

