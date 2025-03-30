import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.overflowX = "auto";
      document.body.style.overflowX = "auto";
    };
  }, []);

  // 📌 Fonction pour envoyer les identifiants au backend
  const handleLogin = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      });

      if (response.data.token && response.data.id) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.id);    
        navigate("/home");  
      }
    } catch (error) {
      setError("Email ou mot de passe incorrect !");
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.default",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: "80%",
          minWidth: "70%",
          maxWidth: "90%",
          padding: "5%",
          boxShadow: 3,
          borderRadius: "5%",
          backgroundColor: "background.paper",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "auto",
          minHeight: "50%",
          maxHeight: "60%",
          overflowY: "auto",
          margin: "auto",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: "1.9rem" }}>
          Connexion
        </Typography>

        {error && (
          <Typography color="error" sx={{ marginBottom: "10px" }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", marginTop: "10%" }}>
          <TextField
            fullWidth
            label="Email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ marginBottom: "10px" }}
          />

          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Box sx={{ marginTop: "18%" }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                padding: "12px",
                fontSize: "1rem",
                color: "background.default",
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              <strong>Connexion</strong>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ConnexionPage;
