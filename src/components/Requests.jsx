import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Requests.css"; // Assuming you have a separate CSS file for styling

const Requests = () => {
  const [requests, setRequests] = useState([]);

  // Fetch the pending requests from the server when component mounts
  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/requests");
      setRequests(response.data); // Set the requests data fetched from the server
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  useEffect(() => {
    fetchRequests(); // Fetch requests on component mount
  }, []);

 const handleAccept = async (code) => {
  try {
    // Corrected endpoint
    await axios.post('/api/requests/accept', { code });
    console.log('Request accepted:', code);
    fetchRequests(); // Refresh the list of requests after accepting
  } catch (error) {
    console.error('Error accepting request:', error);
  }
};


  const handleReject = async (code) => {
    try {
      await axios.post("/api/requestsReject", { code });
      setRequests(requests.filter((request) => request.code !== code)); // Remove rejected request
    } catch (error) {
      console.error("Error rejecting request", error);
    }
  };

  return (
    <div className="requests-container">
      <h2>Pending Tag Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="requests-list">
          {requests.map((request) => (
            <li key={request.code} className="request-item">
              <div className="request-info">
                <p>
                  <strong>Hex Code:</strong> {request.code}
                </p>
                <p>
                  <strong>Owner:</strong> {request.owner || "Unknown"}
                </p>
              </div>
              <div className="request-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAccept(request.code)}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(request.code)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Requests;
