import React, { Component } from "react";
import "./App.css";
import AppStart from "./AppStart";
import * as BibtexAPI from "./utils/BibtexAPI";
import AnalyzeErrors from "./AnalzyeErrors";

class App extends Component {
  state = {
    bibtexText: "",
    entries: [],
    capitalizationOptions: [],
    authorNameOptions: [],
    missingFieldsOptions: []
  };

  componentDidMount() {
    this.setState(
      prevState => ({
        capitalizationOptions: prevState.entries.map(entry => ({
          id: entry.id,
          checked: false
        })),
        authorNameOptions: this.setInitialAuthorNameOptions(prevState.entries),
        missingFieldsOptions: this.setInitialMissingFieldsOptions(
          prevState.entries
        )
      }),
      this.getEntriesFromServer()
    );
  }

  setInitialAuthorNameOptions = entries =>
    entries
      .filter(
        entry =>
          entry.AUTHOR != null &&
          entry.AUTHOR.some(
            author =>
              author.abbreviated ||
              author.misspelling ||
              author.changedAbbreviation
          )
      )
      .flatMap(entry =>
        entry.AUTHOR.filter(
          author =>
            author.abbreviated ||
            author.misspelling ||
            author.changedAbbreviation
        ).map(author => ({
          entryId: entry.id,
          title: entry.TITLE,
          author: author.name,
          suggestion: author.suggestion,
          checked: false
        }))
      );

  setInitialMissingFieldsOptions = entries =>
    entries
      .filter(entry => entry.missingRequiredFields.length > 0)
      .flatMap(entry =>
        entry.missingRequiredFields.map(missingField => ({
          entryId: entry.id,
          title: entry.TITLE,
          field: missingField,
          suggestion: "",
          checked: false
        }))
      );

  getEntriesFromServer = () => {
    BibtexAPI.get().then(stateServer => {
      this.loadDataFromServer(stateServer);
    });
  };

  getSelectedEntries = () =>
    this.state.entries.filter(entry =>
      this.state.capitalizationOptions.find(
        option => option.id === entry.id && option.checked
      )
    );

  changeSelectedCapitalization = capitalizationType => {
    this.setState(
      prevState => {
        const newEntries = prevState.entries.map(entry => {
          if (
            prevState.capitalizationOptions.some(
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
      capitalizationOptions: prevState.capitalizationOptions.map(option => {
        option.checked = allSelected;
        return option;
      })
    }));

  changeAllAuthorNameOptions = allSelectedAuthorNameOptions =>
    this.setState(prevState => ({
      authorNameOptions: prevState.authorNameOptions.map(option => {
        option.checked = allSelectedAuthorNameOptions;
        return option;
      })
    }));

  changeAuthorNameOption = authorName => {
    this.setState(prevState => {
      const newOptions = prevState.authorNameOptions.map(option => {
        if (option.author === authorName) {
          return {
            entryId: option.entryId,
            title: option.title,
            author: option.author,
            suggestion: option.suggestion,
            checked: !option.checked
          };
        } else {
          return Object.assign({}, option);
        }
      });
      return { authorNameOptions: newOptions };
    });
  };

  changeOptionsCheckboxes = optionToChange =>
    this.setState(prevState => ({
      capitalizationOptions: prevState.capitalizationOptions
        .filter(option => option.id !== optionToChange.id)
        .concat([optionToChange])
    }));

  changeMissingFieldsOption = missingFieldsOption => {
    this.setState(prevState => {
      const changedOptions = prevState.missingFieldsOptions.map(option => {
        if (
          option.entryId === missingFieldsOption.entryId &&
          option.field === missingFieldsOption.field
        ) {
          return missingFieldsOption;
        } else return option;
      });
      return { missingFieldsOptions: changedOptions };
    });
  };

  loadDataFromServer = stateServer =>
    this.setState({
      entries: stateServer.entries,
      capitalizationOptions: stateServer.entries.map(entry => ({
        id: entry.id,
        checked: false
      })),
      authorNameOptions: this.setInitialAuthorNameOptions(stateServer.entries),
      missingFieldsOptions: this.setInitialMissingFieldsOptions(
        stateServer.entries
      )
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
                newAuthor.changedAbbreviation = true;
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
        this.setState(prevState => ({
          authorNameOptions: this.setInitialAuthorNameOptions(prevState.entries)
        }));
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
    this.setState(prevState => ({
      authorNameOptions: this.setInitialAuthorNameOptions(prevState.entries)
    }));
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

  changeFieldSuggestion = () => {
    this.state.entries
      .filter(entry =>
        this.state.missingFieldsOptions.some(
          option => option.entryId === entry.id && option.checked
        )
      )
      .forEach(entry =>
        this.searchFieldSuggestion(entry.TITLE).then(result => {
          if (
            result.title.length > 0 &&
            result.title[0].toLowerCase().startsWith(entry.TITLE.toLowerCase())
          ) {
            console.log("title is the same");
            this.state.missingFieldsOptions
              .filter(option => option.entryId === entry.id && option.checked)
              .forEach(option => {
                if (option.field === "booktitle" &&
                    result["container-title"] != null &&
                    result["container-title"].length > 0
                  ) {
                    this.addSuggestion(entry.id,
                      "booktitle", result["container-title"][0]);
                } if (option.field === "year" &&
                result.created != null 
                ) {
                  this.addSuggestion(entry.id,
                    "year", result.created["date-parts"][0][0]);
                }
              });
          } else {
            console.log("title is not the same");
          }
        })
      );
  };

  addSuggestion = (id, attributeName, attributeValue) => {
    this.setState(prevState => {
      const newOptions = prevState.missingFieldsOptions.map(option => {
        if (option.entryId === id && option.field === attributeName) {
          const newOption = Object.assign({}, option);
          newOption.suggestion = attributeValue;
          return newOption;
        } else return option;
      });
      return { missingFieldsOptions: newOptions };
    })
  }

  addAttribute = (id, attribute) => {
    console.log(attribute);
    this.setState(prevState => {
      const newEntries = prevState.entries.map(entry => {
        if (entry.id === id) {
          const newObject = Object.assign(entry, attribute);
          console.log(newObject);
          return newObject;
        } else {
          return entry;
        }
      })
      return { entries: newEntries };
    })
  };

  searchFieldSuggestion = title =>
    BibtexAPI.searchMissingField(title.replace(/[\s]+/g, "+")).then(result => {
      if (
        result != null &&
        result.message != null &&
        result.message.items.length > 0 &&
        result.message.items[0] != null
      ) {
        return result.message.items[0];
      } else return null;
    });

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
          capitalizationOptions={this.state.capitalizationOptions}
          changeOption={this.changeOptionsCheckboxes}
          changeAllOptions={this.changeAllOptions}
          changeSelectedCapitalization={this.changeSelectedCapitalization}
          getEntriesFromServer={this.getEntriesFromServer}
          changeAuthorName={this.changeAuthorName}
          changeAuthorSuggestion={this.changeAuthorSuggestion}
          authorNameOptions={this.state.authorNameOptions}
          changeAuthorNameOption={this.changeAuthorNameOption}
          changeAllAuthorNameOptions={this.changeAllAuthorNameOptions}
          missingFieldsOptions={this.state.missingFieldsOptions}
          changeMissingFieldsOption={this.changeMissingFieldsOption}
          changeFieldSuggestion={this.changeFieldSuggestion}
        />
      </div>
    );
  }
}

export default App;
