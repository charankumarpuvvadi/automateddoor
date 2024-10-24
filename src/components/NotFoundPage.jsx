import React from 'react';
import { Link } from 'react-router-dom';
import './404ErrorPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="go-home-button">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
