import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";
import { Step } from "./MultiStepForm";

interface BreadcrumbsProps {
  currentStep: Step;
  onStepClick: (step: Step) => void;
}

const STEP_LABELS = {
  1: "User Profile",
  2: "Job Description",
  3: "Download",
};

function Breadcrumbs({ currentStep, onStepClick }: BreadcrumbsProps) {
  const steps: Step[] = [1, 2, 3];

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" separator="›">
      {steps.map((step) => {
        const isCurrentStep = step === currentStep;
        const isPastStep = step < currentStep;

        if (isCurrentStep) {
          return (
            <Typography
              key={step}
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {STEP_LABELS[step]}
            </Typography>
          );
        }

        if (isPastStep) {
          return (
            <Link
              key={step}
              component="button"
              variant="body1"
              onClick={() => onStepClick(step)}
              sx={{
                cursor: "pointer",
                color: "text.secondary",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {STEP_LABELS[step]}
            </Link>
          );
        }

        // Future step - disabled
        return (
          <Typography
            key={step}
            color="text.disabled"
            sx={{ cursor: "not-allowed" }}
          >
            {STEP_LABELS[step]}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
}

export default Breadcrumbs;

