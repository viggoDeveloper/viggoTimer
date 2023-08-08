// components/RegisterForm.js

import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  // Agrega más campos si deseas almacenar más información del usuario

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Registro de usuario con email y contraseña en Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const { user } = userCredential;

      // Almacenamiento de información adicional del usuario en Firestore
      await firebase.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        username: username,
        // Agrega más campos aquí según tus necesidades
      });

      // Limpiar los campos del formulario después del registro
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Nombre de Usuario:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        {/* Agrega más campos según tus necesidades */}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterForm;
