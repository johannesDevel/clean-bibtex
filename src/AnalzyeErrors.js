import React, { Component } from "react";
import Tabs from "./Tabs";
import CapitalizationCheck from "./CapitalizationCheck";

class AnalyzeErrors extends Component {
  state = {
    textInput: "",
    fileInput: "",
    // options: []
  };

  categories = ["Capitalization", "Author name", "Mandatory fields"];

  changeOptions = (id, checked) => {
    const foundOption = this.state.options.find(option => option.id === id);
    foundOption.checked = checked;


    // if (foundOption != null) {
    // this.setState(prevState => {
    //   options: prevState.filter(options)
    // })
    // }
  }


  render() {
    // const createdOptions = this.props.entries.map(entry => (
    //   {
    //     id: entry.id,
    //     checked: true
    //   }
    // ));

    // this.setState(
    //   {
    //     options: createdOptions
    //   }
    // );


    return (
      <div className="start-wrapper">
        <div className="start">
          <div>
            <Tabs>
              <div
                label="Capitalization"
                status={this.props.categories.capitalization.caseNotFound.length === 0}
              >
                <CapitalizationCheck
                  categories={this.props.categories.capitalization}
                  entries={this.props.entries}
                  corrections={this.props.corrections.capitalization}
                  optionsCheckboxes={this.props.optionsCheckboxes}
                  changeOption={this.props.changeOption}
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
