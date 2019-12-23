import React, { Component } from "react";
import Tabs from "./Tabs";
import CapitalizationCheck from "./CapitalizationCheck";
import MandatoryFieldsCheck from "./MandatoryFieldsCheck";
import AuthorNameCheck from "./AuthorNameCheck";

class AnalyzeErrors extends Component {
  categories = ["Capitalization", "Author name", "Mandatory fields"];

  render() {
    return (
      <div className="start-wrapper">
        <div className="start">
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
                  optionsCheckboxes={this.props.optionsCheckboxes}
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
                <MandatoryFieldsCheck entries={this.props.entries} />
              </div>
            </Tabs>
          </div>
          <button className="download-button">Download BibTeX</button>
        </div>
      </div>
    );
  }
}
export default AnalyzeErrors;
