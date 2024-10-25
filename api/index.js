const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// Other model and connection code...

// Import your accept route
const acceptRoute = require("./api/accept"); // Adjust the path if necessary

// Use the accept route
app.use("/api/requests/accept", acceptRoute);

// Other API endpoints...

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
