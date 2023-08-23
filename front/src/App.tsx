import React from 'react';
import logo from './duck.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          ~ Magical ducky pong ~
        </p>
        <a
          className="App-link"
          href="https://api.intra.42.fr/oauth/authorize"
          target="_blank"
          rel="noopener noreferrer"
        >
          Connexion with 42
        </a>
      </header>
    </div>
  );
}

export default App;
