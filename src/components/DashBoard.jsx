import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [rfidTags, setRfidTags] = useState([]);

  useEffect(() => {
    const getLogs = async () => {
      try {
        const response = await axios.get("/api/log");
        console.log(response);
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching logs", error);
      }
    };
    getLogs();

    const fetchRequests = async () => {
      try {
        const response = await axios.get("/api/requests");
        console.log(response);
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests", error);
      }
    };
    fetchRequests();

    const fetchRFID = async () => {
      try {
        const response = await axios.get("/api/rfid");
        console.log(response);
        setRfidTags(response.data);
      } catch (error) {
        console.error("Error fetching RFID data", error);
      }
    };
    fetchRFID(); 
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: 16 }}>
          <Typography variant="h6">
            <span style={{ color: 'black' }}>Total Accesses</span>
          </Typography>
          <Typography variant="h4">{logs.length}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: 16 }}>
          <Typography variant="h6">
            <span style={{ color: 'black' }}>Pending Requests</span>
          </Typography>
          <Typography variant="h4">{requests.length}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: 16 }}>
          <Typography variant="h6">
            <span style={{ color: 'black' }}>Registered RFID Tags</span>
          </Typography>
          <Typography variant="h4">{rfidTags.length}</Typography>
        </Paper>
      </Grid>

      {/* Recent Activity Logs */}
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: 16 }}>
          <Typography variant="h6"><span style={{color: 'black'}}>Recent Activity</span></Typography>
          <List>
            {logs.slice(0, 5).map((log, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`User: ${log.code} - ${log.status}`}
                  secondary={`Time: ${log.timestamp}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Logs and Requests Buttons */}
      <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/log" style={{ textDecoration: 'none', marginRight: '10px' }}>
          <Button variant="contained" color="primary">View Logs</Button>
        </Link>
        <Link to="/requests" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="secondary">View Requests</Button>
        </Link>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
