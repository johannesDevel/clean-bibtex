import React, { Component } from 'react';
import './App.css';
import AppStart from './AppStart';

class App extends Component {


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            cleanBibteX
          </a>
        </header>
        <AppStart />
      </div>
    );
  }
}

export default App;
