import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await axios.post(`${process.env.REACT_APP_API_URL}/register/`, {
          username,
          password,
        });
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setIsRegistering(false);
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
          username,
          password,
        }, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        localStorage.setItem('token', response.data.access_token);
        onLogin(username);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hata: Kullanıcı adı veya şifre yanlış!');
    }
  };

  return (
    <div className="mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">{isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Kullanıcı Adı"
          className="p-2 border border-gray-300 rounded w-full mb-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          className="p-2 border border-gray-300 rounded w-full mb-2"
          required
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          {isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>
      </form>
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="text-blue-500 mt-4 underline"
      >
        {isRegistering ? 'Giriş Yapmak İçin Tıklayın' : 'Kayıt Olmak İçin Tıklayın'}
      </button>
    </div>
  );
};

export default UserForm;
