import React, { useState, useEffect } from "react";
import { Box, IconButton, TextField, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Slide } from "@mui/material";
import axios from "axios";

const ChatMessages = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [recipientId, setRecipientId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // 📌 Gestion de l'expansion

  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem("userId"), 10);
    if (storedUserId) {
      setUserId(storedUserId);
      setRecipientId(storedUserId === 1 ? 2 : 1);
    } else {
      console.error("❌ Aucun userId trouvé dans localStorage !");
    }
  }, []);

  useEffect(() => {
    if (isOpen && userId && recipientId) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/messages/${userId}/${recipientId}`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error("Erreur lors du chargement des messages :", error));
    }
  }, [isOpen, userId, recipientId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !userId || !recipientId) return;

    const messageData = { sender: userId, receiver: recipientId, content: newMessage };

    axios
      .post(`${process.env.REACT_APP_API_URL}/messages`, messageData, { headers: { "user-id": userId } })
      .then((response) => {
        setMessages([...messages, response.data]);
        setNewMessage("");
      })
      .catch((error) => console.error("Erreur lors de l'envoi du message :", error));
  };

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          width: "100vw",
          height: isExpanded ? "90vh" : "60vh", // 📏 Hauteur limitée
          maxHeight: "90vh", // ✅ Limite pour ne pas déborder
          backgroundColor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          padding: "10px",
          transition: "height 0.3s ease-in-out",
        }}
      >
        {/* 📢 Zone cliquable pour agrandir/réduire */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            mb: 1,
          }}
          onClick={toggleExpand}
        >
          
          <IconButton>{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        </Box>

        {/* 📨 Affichage des messages */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            overflowY: "auto",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg) => {
            const isMyMessage = msg.sender === userId;
            return (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: isMyMessage ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: isMyMessage ? "#1976D2" : "#D32F2F",
                    color: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    maxWidth: "70%",
                    textAlign: isMyMessage ? "right" : "left",
                  }}
                >
                   {msg.content}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* ✍️ Zone de saisie */}
        <Box sx={{ display: "flex", width: "100%", gap: "10px", marginBottom: "10px" }}>
          <TextField
            fullWidth
            label="Écris un message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Envoyer
          </Button>
        </Box>

        {/* ❌ Bouton de fermeture */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10, color: "primary.main" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Slide>
  );
};

export default ChatMessages;
