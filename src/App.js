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

  changeAllOptions = (allSelected) => {
    this.setState((prevState) => ({
      optionsCheckboxes: prevState.optionsCheckboxes.map(option => {
        option.checked = allSelected;
        return option;
      })
    }));
  }

  changeOptionsCheckboxes = optionToChange => {
    this.setState(prevState => ({
      optionsCheckboxes: prevState.optionsCheckboxes
        .filter(option => option.id !== optionToChange.id)
        .concat([optionToChange])
    }));
  };

  loadDataFromServer = stateServer => {
    this.setState({
      entries: stateServer.entries,
      categories: stateServer.categories,
      corrections: stateServer.corrections,
      optionsCheckboxes: stateServer.entries.map(entry => ({ id: entry.id, checked: false }))
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
          changeAllOptions={this.changeAllOptions}
        />
      </div>
    );
  }
}

export default App;
