import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/register', formData);
      Swal.fire('Registrado', res.data.message, 'success');
    } catch (err) {
      Swal.fire('Error', err.response.data.error, 'error');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Registrarse</h2>
      <div>
        <input
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          placeholder="Nombre de usuario"
          required
        />
      </div>
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
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;
