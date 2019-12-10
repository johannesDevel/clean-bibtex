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
              <div label="Author name" status={true}>
                <AuthorNameCheck
                  entries={this.props.entries}
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
