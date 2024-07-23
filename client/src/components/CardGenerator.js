import React, { useState } from 'react';
import axios from 'axios';
import './CardGenerator.css';

const CardGenerator = () => {
    const [cards, setCards] = useState([]);
    const [bin, setBin] = useState('');

    const generateCards = async () => {
        try {
            const response = await axios.post('/api/cards/generate', { bin_number: bin });
            setCards(response.data);
        } catch (error) {
            console.error("Error generating cards:", error);
        }
    };

    return (
        <div className="card-generator">
            <h2>Generar Tarjetas</h2>
            <input 
                type="text" 
                value={bin} 
                onChange={e => setBin(e.target.value)} 
                placeholder="Ingrese BIN" 
            />
            <button onClick={generateCards}>Generar</button>
            <ul>
                {cards.map(card => <li key={card}>{card}</li>)}
            </ul>
        </div>
    );
};

export default CardGenerator;
