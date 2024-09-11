import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CardGenerator from './components/CardGenerator';
import AddressGenerator from './components/AddressGenerator';
import './App.css';  // Asegúrate de que esta línea esté presente

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/generate-cards" component={CardGenerator} />
                    <Route path="/generate-address" component={AddressGenerator} />
                    <Route path="/" exact>
                        <h1>Bienvenido a Dongato App</h1>
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
