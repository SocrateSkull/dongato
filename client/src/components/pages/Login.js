import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', formData);
      Swal.fire('Bienvenido', 'Inicio de sesión exitoso', 'success');
    } catch (err) {
      Swal.fire('Error', err.response.data.error, 'error');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Iniciar Sesión</h2>
      <div>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Correo electrónico"
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Contraseña"
          required
        />
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default Login;
