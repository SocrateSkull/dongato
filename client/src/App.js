import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CardGenerator from './components/CardGenerator';
import AddressGenerator from './components/AddressGenerator';
import './App.css';  // Asegúrate de que este archivo exista

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Ruta para generar tarjetas */}
                    <Route path="/generate-cards" element={<CardGenerator />} />
                    
                    {/* Ruta para generar direcciones */}
                    <Route path="/generate-address" element={<AddressGenerator />} />
                    
                    {/* Ruta principal */}
                    <Route path="/" element={<h1>Bienvenido a Dongato App</h1>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;