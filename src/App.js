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
    categories: {
      capitalization: {
        titleCase: [],
        sentenceCase: [],
        caseNotFound: []
      },
      authorName: {},
      mandatoryFields: {}
    },
    corrections: {
      capitalization: [],
      authorName: [],
      mandatoryFields: []
    },
    optionsCheckboxes: []
  };

  componentDidMount() {
    BibtexAPI.get().then(stateServer => {
      this.loadDataFromServer(stateServer);
      console.log(stateServer);
    });
  }

  getOptionsCheckboxes = entries =>
    entries.map(entry => ({ id: entry.id, checked: true }));

  changeOptionsCheckboxes = optionToChange => {
    this.setState(prevState => ({
      optionsCheckboxes: prevState.optionsCheckboxes
        .filter(option => option.id !== optionToChange.id)
        .concat([optionToChange])
    }));
  };

  loadDataFromServer = stateServer => {
    const options = this.getOptionsCheckboxes(stateServer.entries);
    this.setState({
      entries: stateServer.entries,
      categories: stateServer.categories,
      corrections: stateServer.corrections,
      optionsCheckboxes: options
    });
  };

  onSetBibtexText = textInput => {
    const textInputObject = { bibtexText: textInput };
    BibtexAPI.create(textInputObject).then(text => {
      BibtexAPI.get().then(stateServer => {
        this.loadDataFromServer(stateServer);
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
          categories={this.state.categories}
          corrections={this.state.corrections}
          optionsCheckboxes={this.state.optionsCheckboxes}
          changeOption={this.changeOptionsCheckboxes}
        />
      </div>
    );
  }
}

export default App;
