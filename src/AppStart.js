import React, { Component } from "react";
import FileUpload from "./FileUpload";

class AppStart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBibtex: false,
      textInput: ""
    };
  }

  onChangeText = text => {
    this.setState({ textInput: text }, () => this.checkIfBibtex());
  };

  checkIfBibtex = () => {
    if (
      this.state.textInput.length > 30 &&
      this.state.textInput.includes("@")
    ) {
      console.log("is probably bibtex, will send to server");
      this.props.setBibtex(this.state.textInput);
    } else {
      console.log("is not a bibtex, not sending to server");
    }
  };

  render() {
    return (
      <div className="start-wrapper">
        <div className="start">
          <div className="start-inputs">
            <textarea
              className="start-input-field"
              type="text"
              placeholder="Paste your BibTeX file here"
              value={this.state.bibtexText}
              onChange={event => this.onChangeText(event.target.value)}
            />
            <FileUpload setBibtex={this.props.setBibtex} />
          </div>
        </div>
      </div>
    );
  }
}
export default AppStart;
