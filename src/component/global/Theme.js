import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins"; // Police moderne et équilibrée
import "@fontsource/roboto-slab"; // Police professionnelle pour les titres

const loveTheme = createTheme({
  palette: {
    background: {
      default: "#F5F7FA", // Gris clair très propre
      paper: "#FFFFFF", // Blanc pur pour les composants
    },
    text: {
      primary: "#333333", // Gris foncé professionnel
      secondary: "#606060", // Gris moyen pour contraste subtil
    },
    primary: {
      main: "#4CAF50", // Vert positif évoquant croissance économique
    },
    secondary: {
      main: "#1976D2", // Bleu corporate professionnel
    },
    accent: {
      main: "#FFB300", // Jaune vif discret pour attirer l'attention
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
    h1: {
      fontFamily: "'Roboto Slab', serif",
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#333333",
    },
    h2: {
      fontFamily: "'Roboto Slab', serif",
      fontSize: "2rem",
      fontWeight: 600,
      color: "#1976D2",
    },
    body1: {
      fontSize: "1rem",
      color: "#333333",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#4CAF50",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#43A047",
          },
        },
      },
    },
  },
});

export { loveTheme };