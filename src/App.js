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
              author.changedAbbreviation ||
              author.changedMisspelling
          )
      )
      .flatMap(entry =>
        entry.AUTHOR.filter(
          author =>
            author.abbreviated ||
            author.misspelling ||
            author.changedAbbreviation ||
            author.changedMisspelling
        ).map(author => ({
          entryId: entry.id,
          title: entry.TITLE,
          author: author.name,
          suggestion: author.suggestion,
          checked: false
        }))
      )
      .sort((author1, author2) => {
        if (author1.author < author2.author) return -1;
        if (author1.author > author2.author) return 1;
        return 0;
      });

  setInitialMissingFieldsOptions = entries =>
    entries
      .filter(
        entry =>
          entry.missingRequiredFields.length > 0 ||
          entry.correctedRequiredFields.length > 0
      )
      .flatMap(entry =>
        entry.missingRequiredFields
          .concat(entry.correctedRequiredFields)
          .map(missingField => ({
            entryId: entry.id,
            title: entry.TITLE,
            field: missingField,
            suggestion: [],
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

  changeAuthorNameOption = author => {
    this.setState(prevState => {
      const newOptions = prevState.authorNameOptions.map(option => {
        if (
          option.author === author.author &&
          option.entryId === author.entryId
        ) {
          const newOption = Object.assign({}, option);
          newOption.checked = !option.checked;
          return newOption;
        } else {
          return option;
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
          const changedOption = Object.assign({}, missingFieldsOption);
          changedOption.checked = !changedOption.checked;
          return changedOption;
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

  changeAuthorName = () => {
    this.setState(
      prevState => {
        const newEnries = prevState.entries.map(entry => {
          if (
            entry.AUTHOR != null &&
            this.state.authorNameOptions.some(
              option => option.entryId === entry.id && option.checked
            )
          ) {
            const newEntry = Object.assign({}, entry);
            const newEntryAuthor = newEntry.AUTHOR.map(author => {
              const authorOption = this.state.authorNameOptions.find(
                option =>
                  option.author === author.name &&
                  option.checked &&
                  option.entryId === entry.id
              );
              if (
                authorOption != null &&
                author.suggestion != null &&
                author.suggestion.length > 0 &&
                (author.abbreviated || author.misspelling)
              ) {
                const newAuthor = Object.assign({}, author);
                newAuthor.name = newAuthor.suggestion[0];
                if (author.abbreviated) {
                  newAuthor.abbreviated = false;
                  newAuthor.changedAbbreviation = true;
                }
                if (author.misspelling) {
                  newAuthor.misspelling = false;
                  newAuthor.changedMisspelling = true;
                }
                return newAuthor;
              } else return author;
            });
            newEntry.AUTHOR = newEntryAuthor;
            return newEntry;
          } else {
            return entry;
          }
        });
        return { entries: newEnries };
      },
      () => {
        this.setState(
          prevState => ({
            authorNameOptions: this.setInitialAuthorNameOptions(
              prevState.entries
            )
          }),
          () => {
            BibtexAPI.update({
              entries: this.state.entries
            });
          }
        );
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
              .filter(
                option =>
                  option.entryId === entry.id &&
                  option.checked &&
                  option.suggestion.length === 0
              )
              .forEach(option => {
                if (
                  (option.field === "booktitle" ||
                    option.field === "journal") &&
                  result["container-title"] != null &&
                  result["container-title"].length > 0
                ) {
                  this.addSuggestion(entry.id, option.field, [
                    result["container-title"][0]
                  ]);
                }
                if (option.field === "year" && result.created != null) {
                  this.addSuggestion(entry.id, "year", [
                    result.created["date-parts"][0][0]
                  ]);
                }
                if (
                  option.field === "author" &&
                  result.author != null &&
                  result.author.length > 0
                ) {
                  const authors = result.author.map(
                    author => `${author.family}, ${author.given}`
                  );
                  this.addSuggestion(entry.id, "author", authors);
                }
              });
          } else {
            console.log("title is not the same");
          }
        })
      );
  };

  addSuggestion = (id, attributeName, attributeValues) => {
    attributeValues.forEach(attributeValue => {
      this.setState(prevState => {
        const newOptions = prevState.missingFieldsOptions.map(option => {
          if (option.entryId === id && option.field === attributeName) {
            const newOption = Object.assign({}, option);
            newOption.suggestion.push(attributeValue);
            return newOption;
          } else return option;
        });
        return { missingFieldsOptions: newOptions };
      });
    });
  };

  addMissingField = () => {
    this.state.missingFieldsOptions
      .filter(option => option.checked && option.suggestion.length > 0)
      .forEach(option => {
        this.setState(
          prevState => {
            const changedEntries = prevState.entries.map(entry => {
              if (
                entry.id === option.entryId &&
                entry[option.field.toUpperCase()] == null
              ) {
                const attributeName = option.field.toUpperCase();
                if (option.field === "author") {
                  const newAttribute = {
                    AUTHOR: option.suggestion,
                    abbreviated: false,
                    changedAbbreviation: false,
                    misspelling: false,
                    changedMisspelling: false
                  };
                  const changedEntry = Object.assign(entry, newAttribute);
                  changedEntry.missingRequiredFields = changedEntry.missingRequiredFields.filter(
                    field => field !== "author"
                  );
                  changedEntry.correctedRequiredFields.push("author");
                  return changedEntry;
                } else {
                  const changedEntry = Object.assign(entry, {
                    [attributeName]: option.suggestion[0]
                  });
                  changedEntry.missingRequiredFields = changedEntry.missingRequiredFields.filter(
                    field => field !== option.field
                  );
                  changedEntry.correctedRequiredFields.push(option.field);
                  return changedEntry;
                }
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
      });
    this.removCheckOptions();
  };

  removCheckOptions = () => {
    this.setState(prevState => {
      const changedOptions = prevState.missingFieldsOptions.map(option => {
        if (option.checked) {
          const changedOption = Object.assign({}, option);
          changedOption.checked = false;
          return changedOption;
        } else return option;
      });
      return { missingFieldsOptions: changedOptions };
    });
  };

  selectAllMissingFieldsOptions = checked => {
    this.setState(prevState => {
      const changedOptions = prevState.missingFieldsOptions.map(option => {
        const changedOption = Object.assign({}, option);
        changedOption.checked = checked;
        return changedOption;
      });
      return { missingFieldsOptions: changedOptions };
    });
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
          addMissingField={this.addMissingField}
          selectAllMissingFieldsOptions={this.selectAllMissingFieldsOptions}
        />
      </div>
    );
  }
}

export default App;
