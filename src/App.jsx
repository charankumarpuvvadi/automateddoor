import React from "react";
import { Container, Typography, AppBar, Toolbar } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/DashBoard";
import Requests from "./components/Requests";
import AccessLogs from "./components/AccessLogs";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" component="div">
            IoT Door Managment System
          </Typography>
        </Toolbar>
      </AppBar>

      <Router>
          <Routes>
            <Route path="/requests" element={<Requests />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<AccessLogs />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
    </Container>
  );
}

export default App;
