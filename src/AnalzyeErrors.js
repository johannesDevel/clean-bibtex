import React, { Component } from "react";
import Tabs from "./Tabs";
import CapitalizationCheck from "./CapitalizationCheck";
import MandatoryFieldsCheck from "./MandatoryFieldsCheck";
import AuthorNameCheck from "./AuthorNameCheck";
import * as BibtexAPI from "./utils/BibtexAPI";

class AnalyzeErrors extends Component {
  downloadBibtex = bibtexContent => {
    console.log(bibtexContent);
    if (bibtexContent != null && bibtexContent.bibtex != null) {
      const element = document.createElement("a");
      const file = new Blob([bibtexContent.bibtex], {
        type: "text/plain"
      });
      element.href = URL.createObjectURL(file);
      element.download = "changedBibTeX.bib";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  };

  render() {
    return (
      <div className="start-wrapper">
        <div className="start">
          <div className="start-status">{this.props.status}</div>
          <div>
            <Tabs>
              <div
                label="Capitalization"
                status={
                  !this.props.entries.some(
                    entry => entry.capitalization === "caseNotFound"
                  )
                }
              >
                <CapitalizationCheck
                  entries={this.props.entries}
                  optionsCheckboxes={this.props.capitalizationOptions}
                  changeOption={this.props.changeOption}
                  changeAllOptions={this.props.changeAllOptions}
                  changeSelectedCapitalization={
                    this.props.changeSelectedCapitalization
                  }
                />
              </div>
              <div
                label="Author name"
                status={
                  this.props.entries.filter(
                    entry =>
                      entry.AUTHOR != null &&
                      entry.AUTHOR.some(
                        author => author.abbreviated || author.misspelling
                      )
                  ).length === 0
                }
              >
                <AuthorNameCheck
                  entries={this.props.entries}
                  getEntriesFromServer={this.props.getEntriesFromServer}
                  changeAuthorName={this.props.changeAuthorName}
                  changeAuthorSuggestion={this.props.changeAuthorSuggestion}
                  authorNameOptions={this.props.authorNameOptions}
                  changeAuthorNameOption={this.props.changeAuthorNameOption}
                  changeAllAuthorNameOptions={
                    this.props.changeAllAuthorNameOptions
                  }
                  searchSuggestionFile={this.props.searchSuggestionFile}
                />
              </div>
              <div
                label="Mandatory fields"
                status={
                  !this.props.entries.some(
                    entry => entry.missingRequiredFields.length > 0
                  )
                }
              >
                <MandatoryFieldsCheck
                  entries={this.props.entries}
                  changeMandatoryFieldCheck={
                    this.props.changeMandatoryFieldCheck
                  }
                  toggleMandatorFieldCheck={this.props.toggleMandatorFieldCheck}
                  searchMandatoryFieldSuggestion={
                    this.props.searchMandatoryFieldSuggestion
                  }
                  changeAllMandatoryFieldCheck={
                    this.props.changeAllMandatoryFieldCheck
                  }
                  addMissingFields={this.props.addMissingFields}
                  removeNotMandatoryFields={this.props.removeNotMandatoryFields}
                />
              </div>
            </Tabs>
          </div>
          <div className="download-button-container">
            <button
              className="download-button"
              disabled={
                this.props.entries == null || this.props.entries.length <= 0
              }
              onClick={() =>
                BibtexAPI.getChangedBibtex().then(result =>
                  this.downloadBibtex(result)
                )
              }
            >
              Download changes as BibTeX
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default AnalyzeErrors;
