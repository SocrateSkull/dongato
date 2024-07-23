import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CardGenerator from './components/CardGenerator';
import AddressGenerator from './components/AddressGenerator';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/generate-cards" component={CardGenerator} />
                    <Route path="/generate-address" component={AddressGenerator} />
                    <Route path="/" exact>
                        <h1>Bienvenido a Dongato App</h1>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
