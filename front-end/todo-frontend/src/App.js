import React, { useState } from 'react';
import UserForm from './components/UserForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setUsername(username);
    setIsLoggedIn(true);
  };

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Görev Yönetim Sistemi</h1>
      {!isLoggedIn ? (
        <UserForm onLogin={handleLogin} />
      ) : (
        <>
          <p className="mb-4">Hoş geldin, {username}!</p>
          <TaskForm axiosInstance={axiosInstance} />
          <TaskList axiosInstance={axiosInstance} />
        </>
      )}
      <p className="mt-8 text-sm text-gray-500">Created by EspeeeBne</p>
    </div>
  );
}

export default App;
