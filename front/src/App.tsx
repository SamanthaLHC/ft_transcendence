import React from 'react';
import logo from './duck.png';
import './Auth' 
import './App.css';

const clientid = process.env.REACT_APP_CLIENT_ID;

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
          href={`https://api.intra.42.fr/oauth/authorize?client_id=${clientid}&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&response_type=code`}
        >
          Connexion with 42
        </a>
      </header>
    </div>
  );
}

export default App;
