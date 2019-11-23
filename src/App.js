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
      // console.log(stateServer);
    });
  }

  getSelectedEntries = () =>
    this.state.entries.filter(entry =>
      this.state.optionsCheckboxes.find(
        option => option.id === entry.id && option.checked
      )
    );

  changeSelectedCapitalization = capitalizationType => {
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
            let correctionEntry = null
            if (capitalizationType === 'NoCaseFound') {
              correctionEntry = prevState.originalEntries.find(originalEntry => (
                originalEntry.id === entry.id
              ));
            }
            else {
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
              if (
                !changedCategoriesCaseNotFound.includes(correctionEntry.id)
              ) {
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
          categories: this.state.categories,
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

  loadDataFromServer = stateServer =>
    this.setState({
      originalEntries: stateServer.originalEntries,
      entries: stateServer.entries,
      categories: stateServer.categories,
      corrections: stateServer.corrections,
      optionsCheckboxes: stateServer.entries.map(entry => ({
        id: entry.id,
        checked: false
      }))
    });

  onSetBibtexText = textInput => {
    const textInputObject = { bibtexText: textInput };
    BibtexAPI.create(textInputObject).then(() => (
      BibtexAPI.get().then(stateServer => (
        this.loadDataFromServer(stateServer)
    ))
    ));
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
          changeSelectedCapitalization={this.changeSelectedCapitalization}
        />
      </div>
    );
  }
}

export default App;
