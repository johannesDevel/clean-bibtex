import React, { Component } from "react";
import "./App.css";
import AppStart from "./AppStart";
import * as BibtexAPI from "./utils/BibtexAPI";
import AnalyzeErrors from "./AnalzyeErrors";

class App extends Component {
  state = {
    bibtexText: "",
    entries: [
      {
        id: 1,
        author: "Milton Abramowitz and Irene A. Stegun",
        title: "Handbook of mathematical Functions Wit Tables"
      },
      {
        id: 2,
        author: "Bex, Floris and Villata, Serena",
        title:
          "Legal knowledge and information systems: JURIX 2016: the Twenty-Ninth Annual Conference"
      },
      {
        id: 3,
        author: "Winkels, Raboud Maarten",
        title: "Section Structure of Dutch Court Judgments"
      },
      {
        id: 4,
        author: "Trompper, Maarten and Winkels, Raboud",
        title:
          "Automatic Assignment of Section Structure to Texts of Dutch Court Judgments"
      },
      {
        id: 5,
        author: "Stallings, William",
        title: "Computer Security Principles and Practice"
      }
    ],
    errors: [
      {
        errorType: "Capitalization",
        errorEntries: [1, 2]
      },
      {
        errorType: "Author name",
        errorEntries: [3, 4]
      },
      {
        errorType: "Mandatory fields",
        errorEntries: [5]
      }
    ],
    corrections: [
      {
        correctionType: "TitleCase",
          id: 1,
          title: "Handbook of Mathematical Functions With Tables"
      },
      {
        correctionType: "TitleCase",
          id: 2,
          title:
            "Legal Knowledge and Information Systems: JURIX 2016: the Twenty-Ninth Annual Conference"
      },
      {
        correctionType: "SentencesCase",
          id: 1,
          title: "Handbook of mathematical functions with tables"
      },
      {
        correctionType: "SentencesCase",
          id: 2,
          title:
            "Legal knowledge and information systems: JURIX 2016: the twenty-ninth annual conference"
      }
    ]
  };

  // componentDidMount() {
  //   BibtexAPI.get().then(foundTitleErrors => {
  //     this.setState({ foundErrors: [...foundTitleErrors] });
  //     console.log(foundTitleErrors);
  //   });
  // }

  onSetBibtexText = textInput => {
    const textInputObject = { bibtexText: textInput };
    BibtexAPI.create(textInputObject).then(text => {
      this.setState(() => ({
        bibtexText: textInput
      }));
      // BibtexAPI.get().then(foundTitleErrors => {
      //   this.setState({ foundErrors: [...foundTitleErrors] });
      // });
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
