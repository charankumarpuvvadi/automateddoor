import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, List, ListItem, ListItemText, Typography } from '@mui/material';
// import { fetchAccessLogs } from '../services/api';

function AccessLogs() {
  const [logs, setLogs] = useState([]);

  const getLogs = async () => {
    try {
      const response = await axios.get("/api/log");
      console.log(response);
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  useEffect(() => {
     getLogs();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: 16 }}>
      <Typography variant="h6"><span style = {{color : "black"}}>Access Logs</span></Typography>
      <List>
        {logs.map((log, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`RFID: ${log.code} - Status: ${log.status}`}
              secondary={`Time: ${new Date(log.timestamp).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default AccessLogs;
