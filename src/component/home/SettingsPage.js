import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const SettingsPage = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const formatAmount = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  

  const handleAddSaving = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) {
      setError(true);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}:5000/savings`, { amount: value });
      setSuccess(true);
      setAmount("");
    } catch (err) {
      console.error("Erreur ajout épargne :", err);
      setError(true);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <IconButton onClick={onClose} sx={{ position: "absolute", top: 20, right: 20 }}>
        <CloseIcon />
      </IconButton>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Paramètres
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Ajouter une nouvelle épargne
      </Typography>

      <TextField
        label="Montant (€)"
        type="number"
        variant="outlined"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mb: 2, maxWidth: 300 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddSaving}
        sx={{ maxWidth: 300 }}
      >
        Enregistrer
      </Button>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
      <Alert severity="success" onClose={() => setSuccess(false)}>
        Épargne de {formatAmount(amount)} € enregistrée avec succès !
      </Alert>

      </Snackbar>

      <Snackbar open={error} autoHideDuration={3000} onClose={() => setError(false)}>
        <Alert severity="error" onClose={() => setError(false)}>
          Montant invalide ou erreur serveur.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
