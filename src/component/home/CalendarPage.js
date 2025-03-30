import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Modal, List, ListItem, ListItemText, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import axios from 'axios';
import dayjs from 'dayjs';
import "./Calendar.css";

const CalendarPage = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/transactions`);
      generateEvents(response.data.transactions);
    } catch (error) {
      console.error('Erreur de chargement des transactions:', error);
    }
  };

  const generateEvents = (transactions) => {
    const events = [];

    transactions.forEach((tx) => {
      if (tx.recurring) {
        for (let month = 0; month < 12; month++) {
          events.push({
            title: `${tx.type === 'expense' ? '-' : '+'}${tx.amount}€ ${tx.description}`,
            date: dayjs(tx.date).month(month).format('YYYY-MM-DD'),
            color: tx.type === 'expense' ? '#f44336' : '#4caf50',
          });
        }
      } else {
        events.push({
          title: `${tx.type === 'expense' ? '-' : '+'}${tx.amount}€ ${tx.description}`,
          date: tx.date,
          color: tx.type === 'expense' ? '#f44336' : '#4caf50',
        });
      }
    });

    setEvents(events);
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const selectedEvents = events.filter(event => event.date === selectedDate);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '-5px 0px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, color: 'text.secondary' }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ width: '100%', height: '100%', p: 2, pt: 5, overflowY: 'auto' }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[frLocale]}
          locale="fr"
          headerToolbar={{
            start: 'title',
            center: '',
            end: 'prev,today,next'
          }}    
          buttonText={{ today: 'Aujourd\'hui' }}
          buttonIcons={{
            prev: 'chevron-left',
            next: 'chevron-right',
          }}
          themeSystem="standard"                
          events={events}
          height="auto"
          dateClick={handleDateClick}
          dayMaxEventRows={2}
        />
      </Box>

      <Modal open={Boolean(selectedDate)} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '70%', md: '50%' },
            maxHeight: '80%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
            Transactions du {dayjs(selectedDate).format('DD/MM/YYYY')}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {selectedEvents.length > 0 ? (
            <List>
              {selectedEvents.map((event, index) => (
                <ListItem key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                  <ListItemText primary={event.title} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
              Aucune transaction enregistrée.
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <IconButton onClick={handleCloseModal} color="primary">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CalendarPage;