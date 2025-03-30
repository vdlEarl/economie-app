import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { loveTheme } from "../component/global/Theme";
import { Routes, Route } from "react-router-dom";
import ConnexionPage from "../component/connexion/ConnexionPage";
import HomePage from "../component/home/HomePage";

function App() {

  return (
    <ThemeProvider theme={loveTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ConnexionPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
