import React, { Component } from "react";

class AnalyzeErrors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textInput: "",
      fileInput: ""
    };
  }

  render() {
    const foundErrors = this.props.foundErrors;

    return (
      <div className="start-wrapper">
        <div className="start">
          <div className="start-help-text">
            {`${foundErrors.length} inconsistencies found`}
          </div>
          {foundErrors.length > 0 && (
            <div>
              <ol>
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
              </ol>
              <button className="download-button">Download BibTeX</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default AnalyzeErrors;
