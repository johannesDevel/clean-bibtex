import React, { Component } from "react";
import "./App.css";
import AppStart from "./AppStart";
import * as BibtexAPI from "./utils/BibtexAPI";
import AnalyzeErrors from "./AnalzyeErrors";
import MockData from "./utils/MockData";

class App extends Component {
  state = {
    bibtexText: "",
    entries: [
      {
        id: 1,
        author: "Milton Abramowitz and Irene A. Stegun",
        TITLE: "Handbook of mathematical Functions with Tables",
        capitalization: "caseNotFound",
        correctionTitleCase: "Handbook of Mathematical Functions With Tables",
        correctionSentenceCase:
          "Handbook of mathematical functions with tables",
        correctionNoCase: "Handbook of mathematical Functions with Tables",
        missingRequiredFields: []
      },
      {
        id: 2,
        author: "Bex, Floris and Villata, Serena",
        TITLE:
          "Legal knowledge and information systems: JURIX 2016: the twenty-ninth annual conference",
        capitalization: "sentenceCase",
        correctionTitleCase:
          "Legal Knowledge and Information Systems: JURIX 2016: the Twenty-Ninth Annual Conference",
        correctionSentenceCase:
          "Legal knowledge and information systems: JURIX 2016: the twenty-ninth annual conference",
          correctionNoCase: "Legal knowledge and information systems: JURIX 2016: the twenty-ninth annual conference",
        missingRequiredFields: []
      },
      {
        id: 3,
        author: "Winkels, Raboud Maarten",
        TITLE: "Section Structure of Dutch Court Judgments",
        capitalization: "titleCase",
        correctionTitleCase: "Section Structure of Dutch Court Judgments",
        correctionSentenceCase: "Section structure of dutch court judgments",
        correctionNoCase: "Section Structure of Dutch Court Judgments",
        missingRequiredFields: []
      },
      {
        id: 4,
        author: "Trompper, Maarten and Winkels, Raboud",
        TITLE:
          "Automatic Assignment of Section Structure to Texts of Dutch Court Judgments",
        capitalization: "titleCase",
        correctionTitleCase:
          "Automatic Assignment of Section Structure to Texts of Dutch Court Judgments",
        correctionSentenceCase:
          "Automatic assignment of section structure to texts of dutch court judgments",
          correctionNoCase: "Automatic Assignment of Section Structure to Texts of Dutch Court Judgments",
        missingRequiredFields: []
      },
      {
        id: 5,
        author: "Stallings, William",
        TITLE: "Computer Security Principles and Practice",
        capitalization: "caseNotFound",
        correctionTitleCase: "Computer Security Principles and Practice",
        correctionSentenceCase: "Computer security principles and practice",
        correctionNoCase: "Computer Security Principles and Practice",
        missingRequiredFields: []
      }
    ],
    optionsCheckboxes: []
  };

  componentDidMount() {
    this.setState(prevState => ({
      optionsCheckboxes: prevState.entries.map(entry => ({
        id: entry.id,
        checked: false
      }))
    }));
    // BibtexAPI.get().then(stateServer => {
    //   this.loadDataFromServer(stateServer);
    //   console.log(stateServer);
    // });
  }

  getSelectedEntries = () =>
    this.state.entries.filter(entry =>
      this.state.optionsCheckboxes.find(
        option => option.id === entry.id && option.checked
      )
    );

  changeSelectedCapitalization = capitalizationType => {
    this.setState(prevState => {
      const newEntries = prevState.entries.map(entry => {
        if (prevState.optionsCheckboxes.some(option => option.id === entry.id && option.checked)) {
          const changedEntry = Object.assign({}, entry);
          changedEntry.capitalization = capitalizationType;
          if (capitalizationType === 'noCaseFound') {
            changedEntry.TITLE = changedEntry.correctionNoCase;
          }
          else if (capitalizationType === 'titleCase') {
            changedEntry.TITLE = changedEntry.correctionTitleCase;
          }
          else if (capitalizationType === 'sentenceCase'){
            changedEntry.TITLE = changedEntry.correctionSentenceCase;
          }
          return changedEntry;
        }
        else {
          return Object.assign({}, entry);
        }
        });
        return { entries: newEntries}
    });
    this.changeAllOptions(false);
  };

  changeSelectedCapitalization2 = capitalizationType => {
    this.setState(
      prevState => {
        let changedCategories = null;
        let changedCategoriesTitle =
          prevState.categories.capitalization.titleCase;
        let changedCategoriesSentence =
          prevState.categories.capitalization.sentenceCase;
        let changedCategoriesCaseNotFound =
          prevState.categories.capitalization.caseNotFound;
        const changedEntries = prevState.entries.map(entry => {
          const changedEntry = this.getSelectedEntries().find(
            selectedEntry => selectedEntry.id === entry.id
          );
          if (changedEntry != null) {
            let correctionEntry = null;
            if (capitalizationType === "NoCaseFound") {
              correctionEntry = prevState.originalEntries.find(
                originalEntry => originalEntry.id === entry.id
              );
            } else {
              correctionEntry = prevState.corrections.capitalization.find(
                correction =>
                  correction.entryId === entry.id &&
                  correction.correctionType === capitalizationType
              );
            }

            if (capitalizationType === "TitleCase") {
              if (!changedCategoriesTitle.includes(correctionEntry.entryId)) {
                changedCategoriesTitle = changedCategoriesTitle.concat(
                  correctionEntry.entryId
                );
              }
              changedCategoriesSentence = changedCategoriesSentence.filter(
                id => id !== correctionEntry.entryId
              );
              changedCategoriesCaseNotFound = changedCategoriesCaseNotFound.filter(
                id => id !== correctionEntry.entryId
              );
            }
            if (capitalizationType === "SentencesCase") {
              if (
                !changedCategoriesSentence.includes(correctionEntry.entryId)
              ) {
                changedCategoriesSentence = changedCategoriesSentence.concat(
                  correctionEntry.entryId
                );
              }
              changedCategoriesTitle = changedCategoriesTitle.filter(
                id => id !== correctionEntry.entryId
              );
              changedCategoriesCaseNotFound = changedCategoriesCaseNotFound.filter(
                id => id !== correctionEntry.entryId
              );
            }
            if (capitalizationType === "NoCaseFound") {
              if (!changedCategoriesCaseNotFound.includes(correctionEntry.id)) {
                changedCategoriesCaseNotFound = changedCategoriesCaseNotFound.concat(
                  correctionEntry.id
                );
              }
              changedCategoriesTitle = changedCategoriesTitle.filter(
                id => id !== correctionEntry.id
              );
              changedCategoriesSentence = changedCategoriesSentence.filter(
                id => id !== correctionEntry.id
              );
            }
            changedCategories = {
              titleCase: changedCategoriesTitle,
              sentenceCase: changedCategoriesSentence,
              caseNotFound: changedCategoriesCaseNotFound
            };
            const newTitle = correctionEntry.TITLE;
            return { ...entry, TITLE: newTitle };
          } else {
            return entry;
          }
        });
        return {
          entries: changedEntries,
          categories: { capitalization: changedCategories }
        };
      },
      () => {
        BibtexAPI.update({
          entries: this.state.entries,
          categories: this.state.categories
        });
        console.log(this.state);
      }
    );
    this.changeAllOptions(false);
  };

  changeAllOptions = allSelected =>
    this.setState(prevState => ({
      optionsCheckboxes: prevState.optionsCheckboxes.map(option => {
        option.checked = allSelected;
        return option;
      })
    }));

  changeOptionsCheckboxes = optionToChange =>
    this.setState(prevState => ({
      optionsCheckboxes: prevState.optionsCheckboxes
        .filter(option => option.id !== optionToChange.id)
        .concat([optionToChange])
    }));

  // loadDataFromServer = stateServer =>
  //   this.setState({
  //     originalEntries: stateServer.originalEntries,
  //     entries: stateServer.entries,
  //     categories: stateServer.categories,
  //     corrections: stateServer.corrections,
  //     optionsCheckboxes: stateServer.entries.map(entry => ({
  //       id: entry.id,
  //       checked: false
  //     }))
  //   });

  // onSetBibtexText = textInput => {
  //   const textInputObject = { bibtexText: textInput };
  //   BibtexAPI.create(textInputObject).then(() => (
  //     BibtexAPI.get().then(stateServer => (
  //       this.loadDataFromServer(stateServer)
  //   ))
  //   ));
  // };

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
          optionsCheckboxes={this.state.optionsCheckboxes}
          changeOption={this.changeOptionsCheckboxes}
          changeAllOptions={this.changeAllOptions}
          changeSelectedCapitalization={this.changeSelectedCapitalization}
        />
      </div>
    );
  }
}

export default App;
