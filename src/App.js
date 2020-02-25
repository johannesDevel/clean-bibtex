import React, { Component } from "react";
import "./App.css";
import AppStart from "./AppStart";
import * as BibtexAPI from "./utils/BibtexAPI";
import AnalyzeErrors from "./AnalzyeErrors";
import getNotRequiredFields from "./utils/getNotRequiredFields";

class App extends Component {
  state = {
    bibtexText: "",
    entries: [],
    capitalizationOptions: [],
    authorNameOptions: [],
    status: ""
  };

  componentDidMount() {
    this.setState(
      prevState => ({
        capitalizationOptions: prevState.entries.map(entry => ({
          id: entry.id,
          checked: false
        })),
        authorNameOptions: this.setInitialAuthorNameOptions(prevState.entries)
      }),
      this.getEntriesFromServer()
    );
  }

  setInitialAuthorNameOptions = entries => {
    return entries
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
          onlineSuggestion: author.onlineSuggestion,
          checked: false
        }))
      )
      .sort((author1, author2) => {
        if (author1.author < author2.author) return -1;
        if (author1.author > author2.author) return 1;
        return 0;
      });
  };

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
        return {
          entries: newEntries,
          status: "changed capitalization of selected entries"
        };
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

  loadDataFromServer = stateServer =>
    this.setState({
      entries: stateServer.entries,
      capitalizationOptions: stateServer.entries.map(entry => ({
        id: entry.id,
        checked: false
      })),
      authorNameOptions: this.setInitialAuthorNameOptions(stateServer.entries),
      status:
        stateServer.entries.length > 0
          ? "BibTeX loaded successfully"
          : "No BibTeX found"
    });

  setInvalidFileInfo = () => {
    this.setState({ status: "ERROR: could not read file, invalid BibTeX" });
  };

  onSetBibtexText = textInput => {
    if (textInput.length > 30 && textInput.includes("@")) {
      this.setState({ status: "Found a new BibTeX and loaded entries" });
      const textInputObject = { bibtexText: textInput };
      BibtexAPI.create(textInputObject)
        .then(() =>
          BibtexAPI.get()
            .then(stateServer =>
              this.setState({
                entries: stateServer.entries,
                capitalizationOptions: stateServer.entries.map(entry => ({
                  id: entry.id,
                  checked: false
                })),
                authorNameOptions: this.setInitialAuthorNameOptions(
                  stateServer.entries
                ),
                status:
                  stateServer.entries.length > 0
                    ? "Found a new BibTeX and loaded entries"
                    : "No BibTeX found"
              })
            )
            .catch(() => this.setInvalidFileInfo())
        )
        .catch(() => this.setInvalidFileInfo());
    } else {
      this.setInvalidFileInfo();
    }
  };

  changeAuthorName = suggestionArray => {
    let changedNames = 0;
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
                author[suggestionArray] != null &&
                author[suggestionArray].length > 0 &&
                (author.abbreviated ||
                  author.misspelling ||
                  author.changedAbbreviation)
              ) {
                const newAuthor = Object.assign({}, author);
                newAuthor.name = newAuthor[suggestionArray][0];
                changedNames++;
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
        return {
          entries: newEnries,
          status:
            changedNames > 0
              ? `Changed ${changedNames} author name(s)`
              : `Changed no author name`
        };
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
    let foundCount = 0;
    this.setState({ status: "searching author online..." });
    options.forEach(option => {
      this.searchAuthorSuggestion(option.title, option.author).then(
        foundAuthorSuggestion => {
          if (foundAuthorSuggestion != null) {
            this.setState(
              prevState => {
                const changedEntries = prevState.entries.map(entry => {
                  if (entry.id === option.entryId) {
                    const changedAuthors = entry.AUTHOR.map(author => {
                      if (
                        author.name === option.author &&
                        !author.onlineSuggestion.includes(foundAuthorSuggestion)
                      ) {
                        foundCount++;
                        const changedAuthor = Object.assign({}, author);
                        changedAuthor.onlineSuggestion.unshift(
                          foundAuthorSuggestion
                        );
                        return changedAuthor;
                      } else return author;
                    });
                    entry.AUTHOR = changedAuthors;
                    return entry;
                  } else return entry;
                });
                return {
                  entries: changedEntries,
                  status:
                    foundCount > 0
                      ? `Found ${foundCount} author name(s) online`
                      : `No author name found`
                };
              },
              () => {
                BibtexAPI.update({
                  entries: this.state.entries
                });
                this.setState(prevState => ({
                  authorNameOptions: this.setInitialAuthorNameOptions(
                    prevState.entries
                  )
                }));
              }
            );
          }
        }
      );
    });
  };

  // searchSuggestionFile = () => {
  //   const changedEntries = [...this.state.entries];
  //   this.state.authorNameOptions
  //     .filter(option => option.checked && option.suggestion.length > 1)
  //     .forEach(option => {
  //       const changedEntry = {
  //         ...changedEntries.find(entry => entry.id === option.entryId)
  //       };
  //       const changedAuthors = [...changedEntry.AUTHOR];
  //       const changedFoundAuthor = {
  //         ...changedAuthors.find(author => author.name === option.author)
  //       };
  //       const lastSuggestion =
  //         changedFoundAuthor.suggestion[
  //           changedFoundAuthor.suggestion.length - 1
  //         ];
  //       changedFoundAuthor.suggestion = [];
  //       changedFoundAuthor.suggestion.unshift(lastSuggestion);
  //       changedAuthors[changedFoundAuthor.id] = changedFoundAuthor;
  //       changedEntry.AUTHOR = changedAuthors;
  //       changedEntries[changedEntry.id] = changedEntry;
  //     });
  //   this.setState({ entries: changedEntries }, () => {
  //     BibtexAPI.update({
  //       entries: this.state.entries
  //     });
  //     this.setState(prevState => ({
  //       authorNameOptions: this.setInitialAuthorNameOptions(prevState.entries)
  //     }));
  //   });
  // };

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
          return `${foundAuthor.family}, ${foundAuthor.given}`;
        } else return null;
      } else return null;
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

  changeAllMandatoryFieldCheck = checked => {
    const changedEntries = [...this.state.entries];
    changedEntries.forEach((entry, index) => {
      changedEntries[index] = { ...entry, mandatoryFieldsCheck: checked };
    });
    this.setState({ entries: changedEntries }, () =>
      BibtexAPI.update({
        entries: this.state.entries
      })
    );
  };

  toggleMandatorFieldCheck = id =>
    this.changeMandatoryFieldCheck(
      id,
      !this.state.entries[id].mandatoryFieldsCheck
    );

  changeMandatoryFieldCheck = (id, checked) => {
    const changedEntries = [...this.state.entries];
    const changedEntry = {
      ...changedEntries[id],
      mandatoryFieldsCheck: checked
    };
    changedEntries[id] = changedEntry;
    this.setState({ entries: changedEntries });
  };

  searchMandatoryFieldSuggestion = () => {
    this.setState({ status: "searching mandatory fields online..." });
    let foundFields = 0;
    const changedEntries = [...this.state.entries];
    changedEntries
      .filter(
        entry =>
          entry.mandatoryFieldsCheck && entry.missingRequiredFields.length > 0
      )
      .forEach(entry => {
        const changedEntry = { ...changedEntries[entry.id] };
        changedEntry.checkedSearched = true;
        this.searchFieldSuggestion(changedEntry.TITLE).then(result => {
          if (
            result.title.length > 0 &&
            result.title[0]
              .toLowerCase()
              .startsWith(entry.TITLE.toLowerCase()[0])
          ) {
            const changedMissingFields = [...entry.missingRequiredFields];
            changedMissingFields.forEach(missingField => {
              const missingFieldUpperCase = missingField.toUpperCase();
              if (
                (missingFieldUpperCase === "BOOKTITLE" ||
                  missingFieldUpperCase === "JOURNAL") &&
                result["container-title"] != null &&
                result["container-title"].length > 0
              ) {
                foundFields++;
                changedEntry.mandatoryFieldsSuggestions[missingFieldUpperCase] =
                  result["container-title"][0];
                changedEntries[entry.id] = changedEntry;
                this.setState(
                  {
                    entries: changedEntries,
                    status:
                      foundFields > 0
                        ? `Found ${foundFields} mandatory field(s) online`
                        : `Found no mandatory fields online`
                  },
                  () =>
                    BibtexAPI.update({
                      entries: this.state.entries
                    })
                );
              } else {
                changedEntries[entry.id] = changedEntry;
                this.setState(
                  {
                    entries: changedEntries,
                    status:
                      foundFields > 0
                      ? `Found ${foundFields} mandatory field(s) online`
                      : `Found no mandatory fields online`
                  },
                  () =>
                    BibtexAPI.update({
                      entries: this.state.entries
                    })
                );
              }
              if (missingFieldUpperCase === "YEAR" && result.created != null) {
                foundFields++;
                changedEntry.mandatoryFieldsSuggestions.YEAR =
                  result.created["date-parts"][0][0];
                changedEntries[entry.id] = changedEntry;
                this.setState(
                  {
                    entries: changedEntries,
                    status:
                      foundFields > 0
                      ? `Found ${foundFields} mandatory field(s) online`
                      : `Found no mandatory fields online`
                  },
                  () =>
                    BibtexAPI.update({
                      entries: this.state.entries
                    })
                );
              } else {
                changedEntries[entry.id] = changedEntry;
                this.setState(
                  {
                    entries: changedEntries,
                    status:
                      foundFields > 0
                      ? `Found ${foundFields} mandatory field(s) online`
                      : `Found no mandatory fields online`
                  },
                  () =>
                    BibtexAPI.update({
                      entries: this.state.entries
                    })
                );
              }
              if (
                missingFieldUpperCase === "AUTHOR" &&
                result.author != null &&
                result.author.length > 0
              ) {
                foundFields++;
                const authors = result.author.map(author => ({
                  name: `${author.family}, ${author.given}`,
                  abbreviated: false,
                  changedAbbreviation: false,
                  misspelling: false,
                  changedMisspelling: false,
                  suggestion: []
                }));
                changedEntry.mandatoryFieldsSuggestions.AUTHOR = authors;
                changedEntries[entry.id] = changedEntry;
                this.setState(
                  {
                    entries: changedEntries,
                    status:
                      foundFields > 0
                      ? `Found ${foundFields} mandatory field(s) online`
                      : `Found no mandatory fields online`
                  },
                  () =>
                    BibtexAPI.update({
                      entries: this.state.entries
                    })
                );
              } else {
                changedEntries[entry.id] = changedEntry;
                this.setState(
                  {
                    entries: changedEntries,
                    status:
                      foundFields > 0
                      ? `Found ${foundFields} mandatory field(s) online`
                      : `Found no mandatory fields online`
                  },
                  () =>
                    BibtexAPI.update({
                      entries: this.state.entries
                    })
                );
              }
            });
          } else {
            changedEntries[entry.id] = changedEntry;
            this.setState(
              {
                entries: changedEntries,
                status:
                  foundFields > 0
                  ? `Found ${foundFields} mandatory field(s) online`
                  : `Found no mandatory fields online`
              },
              () =>
                BibtexAPI.update({
                  entries: this.state.entries
                })
            );
          }
        });
      });
  };

  addMissingFields = () => {
    const changedEntries = [...this.state.entries];
    let addedFieldSum = 0;
    changedEntries
      .filter(
        entry =>
          entry.mandatoryFieldsCheck &&
          entry.missingRequiredFields.length > 0 &&
          Object.keys(entry.mandatoryFieldsSuggestions).length > 0
      )
      .forEach(entry => {
        const changedEntry = { ...entry, ...entry.mandatoryFieldsSuggestions };
        const suggestedFieldsKeys = Object.keys(
          changedEntry.mandatoryFieldsSuggestions
        );
        let changedMissingRequiredFields = [
          ...changedEntry.missingRequiredFields
        ];
        suggestedFieldsKeys.forEach(field => {
          addedFieldSum++;
          changedMissingRequiredFields = changedMissingRequiredFields.filter(
            missingField => missingField !== field.toLowerCase()
          );
        });
        changedEntry.missingRequiredFields = changedMissingRequiredFields;
        changedEntries[entry.id] = changedEntry;
      });
    this.setState(
      {
        entries: changedEntries,
        status:
          addedFieldSum > 0
            ? `Added ${addedFieldSum} mandatory field(s) to entries`
            : `Added no field`
      },
      () => this.changeAllMandatoryFieldCheck(false)
    );
  };

  removeNotMandatoryFields = () => {
    let deletedFieldsSum = 0;
    const changedEntries = [...this.state.entries];
    changedEntries
      .filter(entry => entry.mandatoryFieldsCheck)
      .forEach(entry => {
        const changedEntry = { ...entry };
        const entryKeys = Object.keys(changedEntry).filter(
          keys => keys === keys.toUpperCase()
        );
        const notRequiredFields = getNotRequiredFields(
          changedEntry.entryType,
          entryKeys
        );
        notRequiredFields.forEach(field => {
          deletedFieldsSum++;
          delete changedEntry[field];
        });
        changedEntries[entry.id] = changedEntry;
      });
    this.setState(
      {
        entries: changedEntries,
        status:
          deletedFieldsSum > 0
            ? `Deleted ${deletedFieldsSum} field(s)`
            : `Deleted no field`
      },
      () => this.changeAllMandatoryFieldCheck(false)
    );
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-header-text">cleanBibTeX</div>
        </header>
        <AppStart setBibtex={this.onSetBibtexText} />
        {this.state.entries != null && this.state.entries.length > 0 && (
          <AnalyzeErrors
            status={this.state.status}
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
            changeMandatoryFieldCheck={this.changeMandatoryFieldCheck}
            toggleMandatorFieldCheck={this.toggleMandatorFieldCheck}
            searchMandatoryFieldSuggestion={this.searchMandatoryFieldSuggestion}
            changeAllMandatoryFieldCheck={this.changeAllMandatoryFieldCheck}
            addMissingFields={this.addMissingFields}
            removeNotMandatoryFields={this.removeNotMandatoryFields}
            searchSuggestionFile={this.searchSuggestionFile}
          />
        )}
      </div>
    );
  }
}

export default App;
