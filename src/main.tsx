import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90CAF9", // Light blue (works well on dark background)
      light: "#E3F2FD",
      dark: "#42A5F5",
    },
    secondary: {
      main: "#4DB6AC", // Light teal accent
      light: "#80CBC4",
      dark: "#26A69A",
    },
    background: {
      default: "#121212", // Material dark background
      paper: "#1E1E1E", // Slightly lighter for cards/paper
    },
    text: {
      primary: "#FFFFFF", // White text
      secondary: "rgba(255, 255, 255, 0.7)", // Slightly transparent white
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  shape: {
    borderRadius: 8, // Sleek rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Professional, no uppercase
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
