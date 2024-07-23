import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const VerifyEmail = () => {
  const location = useLocation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      try {
        const res = await axios.get(`/api/users/verify-email?token=${token}`);
        setMessage(res.data.message);
        Swal.fire('Verificado', res.data.message, 'success');
      } catch (err) {
        setMessage(err.response.data.error);
        Swal.fire('Error', err.response.data.error, 'error');
      }
    };
    verifyEmail();
  }, [location]);

  return (
    <div>
      <h2>Verificación de correo electrónico</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
