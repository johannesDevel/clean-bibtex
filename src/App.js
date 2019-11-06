import React, { Component } from "react";
import "./App.css";
import AppStart from "./AppStart";
import * as BibtexAPI from "./utils/BibtexAPI";
import AnalyzeErrors from "./AnalzyeErrors";
import mockData from "./utils/MockData";

class App extends Component {
  // state = mockData;
  state = {
    entries: [],
    errors: {
      capitalization: [],
      authorName: [],
      mandatoryFields: []
    },
    corrections: {
      capitalization: [],
      authorName: [],
      mandatoryFields: []
    }
  };

  componentDidMount() {
    BibtexAPI.get().then(stateServer => {
      this.setState({ 
        entries: stateServer.entries,
        errors: stateServer.errors,
        corrections: stateServer.corrections
       });
      console.log(stateServer);
    });
  }

  onSetBibtexText = textInput => {
    const textInputObject = { bibtexText: textInput };
    BibtexAPI.create(textInputObject).then(text => {
      // this.setState(() => ({
      //   bibtexText: textInput
      // }));
      BibtexAPI.get().then(stateServer => {
        this.setState({ 
          entries: stateServer.entries,
          errors: stateServer.errors,
          corrections: stateServer.corrections
        });
        console.log(stateServer);
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
        <AnalyzeErrors
          entries={this.state.entries}
          errors={this.state.errors}
          corrections={this.state.corrections}
        />
      </div>
    );
  }
}

export default App;
