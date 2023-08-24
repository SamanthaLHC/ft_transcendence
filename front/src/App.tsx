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
          href="https://api.intra.42.fr/oauth/authorize?client_id={REPLACE_ME_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code"
        //   rel="noopener noreferrer"
        >
          Connexion with 42
        </a>
      </header>
    </div>
  );
}

export default App;
