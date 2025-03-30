import React, { useState, useEffect } from "react";
import NavBar from "../global/NavBar";
import ChatMessages from "./ChatMessages";
import SearchPage from "./SearchPage";
import CalendarPage from "./CalendarPage";
import SettingsPage from "./SettingsPage";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import dayjs from "dayjs";
import { Box, Slide, Typography, Card, CardContent, Grid, Divider, CircularProgress } from "@mui/material";


const COLORS = ["#4caf50", "#f44336"];



const HomePage = () => {
  const [activePage, setActivePage] = useState("home");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [previousSavings, setPreviousSavings] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(null);
  const [loadingSavings, setLoadingSavings] = useState(true);
  
  const formatAmount = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/transactions`);
      calculateTotals(response.data.transactions);
    } catch (error) {
      console.error("Erreur de chargement des transactions:", error);
    }
  };

  const fetchLatestSavings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/savings/latest`);
      setCurrentSavings(response.data?.amount ?? 0);

    } catch (error) {
      console.error("Erreur récupération épargne:", error);
    } finally {
      setLoadingSavings(false);
    }
  };
  
  useEffect(() => {
    fetchLatestSavings();
  }, []);
  

  const calculateTotals = (transactions) => {
    const today = dayjs();
    const currentMonthStart = today.date() >= 28 ? today.date(28) : today.subtract(1, 'month').date(28);
    const currentMonthEnd = currentMonthStart.add(1, 'month');
    const previousMonthStart = currentMonthStart.subtract(1, 'month');

    let income = 0, expense = 0, prevIncome = 0, prevExpense = 0;

    transactions.forEach((tx) => {
      const txDate = dayjs(tx.date);
      if ((txDate.isAfter(currentMonthStart) || txDate.isSame(currentMonthStart, 'day')) && txDate.isBefore(currentMonthEnd)) {
        tx.type === "income" ? income += tx.amount : expense += tx.amount;
      }
      if ((txDate.isAfter(previousMonthStart) || txDate.isSame(previousMonthStart, 'day')) && txDate.isBefore(currentMonthStart)) {
        tx.type === "income" ? prevIncome += tx.amount : prevExpense += tx.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setPreviousSavings(prevIncome - prevExpense);
  };

  const data = [
    { name: "Rentrées", value: totalIncome },
    { name: "Dépenses", value: totalExpense },
  ];

  return (
    <Box
  sx={{
    width: "100%",
    height: "100vh",
    backgroundColor: "background.default",
    position: "relative",
    overflow: "hidden", // important ici
  }}
>
  {/* Conteneur scrollable */}
  <Box
    sx={{
      flex: 1,
      height: "100%",
      overflowY: "auto",
      px: 2,
      pt: 4,
      pb: 12,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
      <Card sx={{ width: "90%", maxWidth: 400, mb: 3, boxShadow: 2 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Mon Épargne Actuelle
          </Typography>
          {loadingSavings ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h4" color="primary" fontWeight="bold">
              {typeof currentSavings === "number" ? `${formatAmount(currentSavings)} €` : "Aucune donnée"}

            </Typography>
          )}
        </CardContent>
      </Card>


      <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Budget mensuel 
      </Typography>

      <Card sx={{ width: "90%", maxWidth: 400, mx: "auto", boxShadow: 3 }}>

      <CardContent
  sx={{
    maxHeight: "100%", // tu peux ajuster selon la hauteur visible souhaitée
    overflowY: "auto",
    pr: 1, // petite marge pour pas coller la scrollbar
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#ccc",
      borderRadius: "6px",
    },
    scrollbarWidth: "thin", // Firefox
    scrollbarColor: "#ccc transparent",
  }}
>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} outerRadius={80}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)}€`} />
            </PieChart>
          </ResponsiveContainer>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6} textAlign="center">
              <Typography variant="subtitle1" color="success.main" fontWeight="bold">
                Rentrées
              </Typography>
              <Typography>{totalIncome.toFixed(2)}€</Typography>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Typography variant="subtitle1" color="error.main" fontWeight="bold">
                Dépenses
              </Typography>
              <Typography>{totalExpense.toFixed(2)}€</Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="subtitle1" color="primary" fontWeight="bold">
                Reste ce mois
              </Typography>
              <Typography>{(totalIncome - totalExpense).toFixed(2)}€</Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="subtitle1" color="text.secondary">
                Épargne mois précédent
              </Typography>
              <Typography>{previousSavings.toFixed(2)}€</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Slide direction="left" in={activePage === "chat"} mountOnEnter unmountOnExit>
        <Box sx={{ position: "absolute", top: 0, width: "100%", height: "100%" }}>
          <ChatMessages isOpen={true} onClose={() => setActivePage("home")} />
        </Box>
      </Slide>

      <Slide direction="right" in={activePage === "search"} mountOnEnter unmountOnExit>
        <Box sx={{ position: "absolute", top: 0, width: "100%", height: "100%" }}>
          <SearchPage onClose={() => setActivePage("home")} />
        </Box>
      </Slide>

      <Slide direction="right" in={activePage === "calendar"} mountOnEnter unmountOnExit>
        <Box sx={{ position: "absolute", top: 0, width: "100%", height: "100%" }}>
          <CalendarPage onClose={() => setActivePage("home")} />
        </Box>
      </Slide>

      <Slide direction="left" in={activePage === "settings"} mountOnEnter unmountOnExit>
        <Box sx={{ position: "absolute", top: 0, width: "100%", height: "100%" }}>
          <SettingsPage onClose={() => setActivePage("home")} />
        </Box>
      </Slide>

      <NavBar onNavigate={setActivePage} />
      </Box></Box>
  );
};

export default HomePage;
