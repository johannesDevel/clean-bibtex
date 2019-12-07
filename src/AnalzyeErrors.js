import React, { Component } from "react";
import Tabs from "./Tabs";
import CapitalizationCheck from "./CapitalizationCheck";
import MandatoryFieldsCheck from "./MandatoryFieldsCheck";

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
                  true
                  // this.props.categories.capitalization.caseNotFound.length === 0
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
                TODO
              </div>
              <div
                label="Mandatory fields"
                status={
                  true
                  // this.props.entries.filter(
                  //   entry => entry.missingRequiredFields.length > 0
                  // ).length === 0
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
