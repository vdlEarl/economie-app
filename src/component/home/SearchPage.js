import React, { useState } from "react";
import { Box, IconButton, Typography, TextField, Button, ToggleButtonGroup, ToggleButton, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const expenseTypes = ["Alimentation", "Transport", "Logement", "Loisirs", "Santé", "Vêtements", "Abonnements", "Autre"];

const SearchPage = ({ onClose }) => {
  const [mode, setMode] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [store, setStore] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) setMode(newMode);
  };

  const handleSubmit = async () => {
    if (parseFloat(amount) <= 0) {
      alert("Le montant doit être supérieur à 0.");
      return;
    }

    const transaction = {
      type: mode,
      date,
      amount: parseFloat(amount),
      description,
      store: mode === "expense" ? store : null,
      expense_type: mode === "expense" ? expenseType : null,
      recurring: isRecurring,
    };

    try {
      await axios.post("http://localhost:5000/transactions", transaction);
      alert(`${mode === "expense" ? "Dépense" : "Rentrée"} enregistrée avec succès.`);
      setAmount("");
      setDescription("");
      setDate("");
      setStore("");
      setExpenseType("");
      setIsRecurring(false);
    } catch (error) {
      alert("Erreur lors de l'enregistrement : " + error.message);
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
        overflowY: "auto",
      }}
    >
      <IconButton onClick={onClose} sx={{ position: "absolute", top: 20, right: 20 }}>
        <CloseIcon />
      </IconButton>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        sx={{ marginBottom: 3 }}
        fullWidth
      >
        <ToggleButton value="expense">Dépense</ToggleButton>
        <ToggleButton value="income">Rentrée</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        {mode === "expense" ? "Ajouter une dépense" : "Ajouter une rentrée"}
      </Typography>

      {/* Champ Date pour tout le monde */}
      <TextField
        label="Date"
        type="date"
        variant="outlined"
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ marginBottom: 2 }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />


      {mode === "expense" && (
        <>
          

          <TextField
            label="Boutique"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={store}
            onChange={(e) => setStore(e.target.value)}
          />

          <TextField
            select
            label="Type de dépense"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
          >
            {expenseTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </>
      )}

      <TextField
        label="Montant (€)"
        variant="outlined"
        type="number"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <FormControlLabel
        control={<Checkbox checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />}
        label={mode === "expense" ? "Dépense récurrente" : "Rentrée récurrente"}
        sx={{ marginBottom: 3 }}
      />

      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        Valider
      </Button>
    </Box>
  );
};

export default SearchPage;