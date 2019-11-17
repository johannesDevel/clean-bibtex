import React, { Component } from "react";
import Tabs from "./Tabs";
import CapitalizationCheck from "./CapitalizationCheck";

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
                  this.props.categories.capitalization.caseNotFound.length === 0
                }
              >
                <CapitalizationCheck
                  categories={this.props.categories.capitalization}
                  entries={this.props.entries}
                  corrections={this.props.corrections.capitalization}
                  optionsCheckboxes={this.props.optionsCheckboxes}
                  changeOption={this.props.changeOption}
                  changeAllOptions={this.props.changeAllOptions}
                />
              </div>
              <div label="Author name" status={true}>
                TODO
              </div>
              <div label="Mandatory fields" status={true}>
                TODO
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
