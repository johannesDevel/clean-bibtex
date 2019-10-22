import React, { Component } from "react";
import Tabs from "./Tabs";
import CapitalizationCheck from "./CapitalizationCheck";

class AnalyzeErrors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textInput: "",
      fileInput: ""
    };
  }

  categories = ["Capitalization", "Author name", "Mandatory fields"];

  render() {
    let capitalizationErrors = {};

    Object.values(this.props.errors).map(error => {
      if (error.errorType === "Capitalization") {
        capitalizationErrors = error;
      }
    });

    return (
      <div className="start-wrapper">
        <div className="start">
          {/* <div className="start-help-text">
            {`${foundErrors.length} inconsistencies found`}
          </div> */}
          <div>
            <Tabs>
              <div label="Capitalization">
                <CapitalizationCheck
                  error={capitalizationErrors}
                  entriesSum={this.props.entries.length}
                  entries={this.props.entries}
                  corrections={this.props.corrections}
                />
              </div>
              <div label="Author name">
                See ya later, <em>category 2</em>!
              </div>
              <div label="Mandatory fields">
                See ya later, <em>category 3</em>!
              </div>
            </Tabs>
          </div>
          {/* <ol>
            {foundErrors.map(error => (
              <li className="error-list-item" key={error.id}>
                <div>
                  <div>
                    <strong>{`${error.errorType} Error`}</strong>
                  </div>
                  <div>
                    {Object.keys(error.errorDetails).map(key => (
                      <span key={error.errorDetails[key]}>
                        {`${key} : ${error.errorDetails[key]} `}
                        <br></br>
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol> */}

          <button className="download-button">Download BibTeX</button>
        </div>
      </div>
    );
  }
}
export default AnalyzeErrors;
