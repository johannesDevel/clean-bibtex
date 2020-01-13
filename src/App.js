import React, { Component } from "react";
import "./App.css";
import AppStart from "./AppStart";
import * as BibtexAPI from "./utils/BibtexAPI";
import AnalyzeErrors from "./AnalzyeErrors";

class App extends Component {
  state = {
    bibtexText: "",
    entries: [],
    optionsCheckboxes: []
  };

  componentDidMount() {
    this.setState(
      prevState => ({
        optionsCheckboxes: prevState.entries.map(entry => ({
          id: entry.id,
          checked: false
        }))
      }),
      this.getEntriesFromServer()
    );
  }

  getEntriesFromServer = () => {
    BibtexAPI.get().then(stateServer => {
      this.loadDataFromServer(stateServer);
    });
  };

  getSelectedEntries = () =>
    this.state.entries.filter(entry =>
      this.state.optionsCheckboxes.find(
        option => option.id === entry.id && option.checked
      )
    );

  changeSelectedCapitalization = capitalizationType => {
    this.setState(
      prevState => {
        const newEntries = prevState.entries.map(entry => {
          if (
            prevState.optionsCheckboxes.some(
              option => option.id === entry.id && option.checked
            )
          ) {
            const changedEntry = Object.assign({}, entry);
            if (capitalizationType === "initialCase") {
              changedEntry.capitalization = changedEntry.initialCapitalization;
              changedEntry.TITLE = changedEntry.correctionInitialCase;
            } else if (capitalizationType === "titleCase") {
              changedEntry.capitalization = "titleCase";
              changedEntry.TITLE = changedEntry.correctionTitleCase;
            } else if (capitalizationType === "sentenceCase") {
              changedEntry.capitalization = "sentenceCase";
              changedEntry.TITLE = changedEntry.correctionSentenceCase;
            }
            return changedEntry;
          } else {
            return Object.assign({}, entry);
          }
        });
        return { entries: newEntries };
      },
      () => {
        BibtexAPI.update({
          entries: this.state.entries
        });
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
      entries: stateServer.entries,
      optionsCheckboxes: stateServer.entries.map(entry => ({
        id: entry.id,
        checked: false
      }))
    });

  onSetBibtexText = textInput => {
    const textInputObject = { bibtexText: textInput };
    BibtexAPI.create(textInputObject).then(() =>
      BibtexAPI.get().then(stateServer => this.loadDataFromServer(stateServer))
    );
  };

  changeAuthorName = (entryId, authorName) => {
    this.setState(
      prevState => {
        const newEnries = prevState.entries.map(entry => {
          if (entry.AUTHOR != null && entry.id === entryId) {
            const newEntry = Object.assign({}, entry);
            const newEntryAuthor = newEntry.AUTHOR.map(author => {
              if (
                author.name === authorName &&
                author.suggestion != null &&
                author.suggestion.length > 0
              ) {
                const newAuthor = Object.assign({}, author);
                newAuthor.name = newAuthor.suggestion[0];
                newAuthor.abbreviated = false;
                return newAuthor;
              } else {
                return Object.assign({}, author);
              }
            });
            newEntry.AUTHOR = newEntryAuthor;
            return newEntry;
          } else {
            return Object.assign({}, entry);
          }
        });
        return { entries: newEnries };
      },
      () => {
        BibtexAPI.update({
          entries: this.state.entries
        });
      }
    );
  };

  changeAuthorSuggestion = options => {
    options.forEach(option => {
      this.searchAuthorSuggestion(option.title, option.author).then(
        foundAuthorSuggestion => {
          console.log(foundAuthorSuggestion);
          if (foundAuthorSuggestion != null) {
            this.setState(
              prevState => {
                const changedEntries = prevState.entries.map(entry => {
                  if (entry.id === option.entryId) {
                    const changedAuthors = entry.AUTHOR.map(author => {
                      if (author.name === option.author) {
                        const changedAuthor = Object.assign({}, author);
                        changedAuthor.suggestion.unshift(foundAuthorSuggestion);
                        console.log(changedAuthor);
                        return changedAuthor;
                      } else return author;
                    });
                    entry.AUTHOR = changedAuthors;
                    return entry;
                  } else return entry;
                });
                return { entries: changedEntries };
              },
              () => {
                BibtexAPI.update({
                  entries: this.state.entries
                });
              }
            );
          }
        }
      );
    });
  };

  searchAuthorSuggestion = (title, author) => {
    return BibtexAPI.searchAuthor(
      title.replace(/[\s]+/g, "+"),
      author.replace(/[\s]+/g, "+")
    ).then(result => {
      if (
        result != null &&
        result.message != null &&
        result.message.items.length > 0 &&
        result.message.items[0].author != null
      ) {
        const foundAuthor = result.message.items[0].author.find(itemAuthor =>
          author.startsWith(itemAuthor.family)
        );
        if (foundAuthor != null) {
          // console.log(foundAuthor);
          return `${foundAuthor.family}, ${foundAuthor.given}`;
        } else return null;
      } else return null;
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
          optionsCheckboxes={this.state.optionsCheckboxes}
          changeOption={this.changeOptionsCheckboxes}
          changeAllOptions={this.changeAllOptions}
          changeSelectedCapitalization={this.changeSelectedCapitalization}
          getEntriesFromServer={this.getEntriesFromServer}
          changeAuthorName={this.changeAuthorName}
          changeAuthorSuggestion={this.changeAuthorSuggestion}
        />
      </div>
    );
  }
}

export default App;
