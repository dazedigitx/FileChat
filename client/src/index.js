import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext';
import App from './App';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    // Add other headers if necessary
  },
});

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App axiosInstance={axiosInstance} />
    </AuthProvider>
  </React.StrictMode>
);

// console.log('index .js axiosInstance:', axiosInstance);

reportWebVitals();

export default App;
