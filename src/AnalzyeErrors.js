import React, { Component } from "react";
import Tabs from "./Tabs";
import CapitalizationCheck from "./CapitalizationCheck";

class AnalyzeErrors extends Component {
  state = {
    textInput: "",
    fileInput: ""
  };

  categories = ["Capitalization", "Author name", "Mandatory fields"];

  render() {
    return (
      <div className="start-wrapper">
        <div className="start">
          {/* <div className="start-help-text">
            {`${foundErrors.length} inconsistencies found`}
          </div> */}
          <div>
            <Tabs>
              <div
                label="Capitalization"
                status={this.props.errors.capitalization.length === 0}
              >
                <CapitalizationCheck
                  errors={this.props.errors.capitalization}
                  entries={this.props.entries}
                  corrections={this.props.corrections.capitalization}
                />
              </div>
              <div label="Author name" status={true}>
                See ya later, <em>category 2</em>!
              </div>
              <div label="Mandatory fields" status={true}>
                See ya later, <em>category 3</em>!
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
