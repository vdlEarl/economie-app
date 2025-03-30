import React from "react";
import { Box, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from '@mui/icons-material/Add';

const NavBar = ({ onNavigate }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100vw",
        height: "70px",
        backgroundColor: "background.paper",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        zIndex: 1000,
      }}
    >
      <IconButton onClick={() => onNavigate("search")} sx={{ minWidth: "60px" }}>
        <AddIcon sx={{ fontSize: "30px", color: "primary.main" }} />
      </IconButton>

      <IconButton onClick={() => onNavigate("calendar")} sx={{ minWidth: "60px" }}>
        <CalendarTodayIcon sx={{ fontSize: "30px", color: "primary.main" }} />
      </IconButton>

      <Box
        sx={{
          position: "relative",
          top: "-20px",
          backgroundColor: "primary.main",
          borderRadius: "50%",
          width: "75px",
          height: "75px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <IconButton onClick={() => onNavigate("home")} sx={{ color: "#FFFFFF" }}>
          <HomeIcon sx={{ fontSize: "40px" }} />
        </IconButton>
      </Box>

      <IconButton onClick={() => onNavigate("chat")} sx={{ minWidth: "60px" }}>
        <ChatIcon sx={{ fontSize: "30px", color: "primary.main" }} />
      </IconButton>

      <IconButton onClick={() => onNavigate("settings")} sx={{ minWidth: "60px" }}>
        <SettingsIcon sx={{ fontSize: "30px", color: "primary.main" }} />
      </IconButton>
    </Box>
  );
};

export default NavBar;