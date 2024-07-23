import React, { useState } from 'react';
import axios from 'axios';
import './AddressGenerator.css';

const AddressGenerator = () => {
    const [address, setAddress] = useState({});
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [gender, setGender] = useState('Masculino');

    const generateAddress = async () => {
        try {
            const response = await axios.post('/api/addresses/generate', { country, state, gender });
            setAddress(response.data);
        } catch (error) {
            console.error("Error generating address:", error);
        }
    };

    return (
        <div className="address-generator">
            <h2>Generar Dirección y Teléfono</h2>
            <input 
                type="text" 
                value={country} 
                onChange={e => setCountry(e.target.value)} 
                placeholder="Ingrese País" 
            />
            <input 
                type="text" 
                value={state} 
                onChange={e => setState(e.target.value)} 
                placeholder="Ingrese Estado" 
            />
            <select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
            </select>
            <button onClick={generateAddress}>Generar</button>
            {address.name && (
                <div>
                    <p>Nombre: {address.name}</p>
                    <p>Calle: {address.street}</p>
                    <p>Ciudad: {address.city}</p>
                    <p>Estado: {address.state}</p>
                    <p>Código Postal: {address.zip_code}</p>
                    <p>País: {address.country}</p>
                    <p>Teléfono: {address.phone_number}</p>
                </div>
            )}
        </div>
    );
};

export default AddressGenerator;
