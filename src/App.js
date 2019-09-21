import React, { Component } from "react";
import "./App.css";
import AppStart from "./AppStart";
import * as BibtexAPI from "./utils/BibtexAPI";
import AnalyzeErrors from "./AnalzyeErrors";

class App extends Component {
  state = {
    bibtexText: "",
    foundErrors: []
  };

  componentDidMount() {
    BibtexAPI.get().then(foundTitleErrors => {
      this.setState({ foundErrors: [...foundTitleErrors] });
    });
  }

  onSetBibtexText = textInput => {
    const textInputObject = { bibtexText: textInput };
    BibtexAPI.create(textInputObject).then(text => {
      this.setState(() => ({
        bibtexText: textInput
      }));
      BibtexAPI.get().then(foundTitleErrors => {
        this.setState({ foundErrors: [...foundTitleErrors] });
      });
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a className="App-link" href="app">
            cleanBibteX
          </a>
        </header>
        <AppStart setBibtex={this.onSetBibtexText} />
        <AnalyzeErrors foundErrors={this.state.foundErrors} />
      </div>
    );
  }
}

export default App;
