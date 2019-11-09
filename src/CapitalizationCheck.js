import React, { Component } from "react";

class CapitalizationCheck extends Component {
  state = {
    showAdvancedSettings: false,
    correctedElements: [],
  };

  getCorrectedTitleCase = id =>
    this.props.corrections.find(
      correction =>
        correction.entryId === id && correction.correctionType === "TitleCase"
    );

  getCorrectedSentenceCase = id =>
    this.props.corrections.find(
      correction =>
        correction.entryId === id &&
        correction.correctionType === "SentencesCase"
    );

  getTitleCaseEntries = entry => {
    if (!this.props.errors.includes(entry.id)) {
      return entry;
    }
    else {
      return { TITLE: 'no entry' };
    }
  };

  handleButton = () => {
    this.setState(prevState => ({
      showAdvancedSettings: !prevState.showAdvancedSettings
    }));
  };

  addCorrectedSentencesElement = selectedEntry => {
    const filteredcorrectedElements = this.state.correctedElements.filter(
      element => element.entryId !== selectedEntry.entryId
    );
    filteredcorrectedElements.push(selectedEntry);
    this.setState({
      correctedElements: filteredcorrectedElements,
      defaultValueChecked: false
    });
    console.log(
      `radio button default value is: ${this.state.defaultValueChecked}`
    );
  };

  addCorrectedTitleElement = selectedEntry => {
    const filteredcorrectedElements = this.state.correctedElements.filter(
      element => element.entryId !== selectedEntry.entryId
    );
    filteredcorrectedElements.push(selectedEntry);
    this.setState({
      correctedElements: filteredcorrectedElements,
      defaultValueChecked: false
    });
    console.log(
      `radio button default value is: ${this.state.defaultValueChecked}`
    );
  };

  removeCorrectedElement = id => {
    const filteredcorrectedElements = this.state.correctedElements.filter(
      element => element.entryId !== id
    );
    this.setState({
      correctedElements: filteredcorrectedElements,
      defaultValueChecked: true
    });
    console.log(
      `radio button default value is: ${this.state.defaultValueChecked}`
    );
  };

  handleSaveSelection = () => {
    console.log(this.state.correctedElements);
  };

  render() {
    const { entries, errors, corrections } = this.props;

    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{entries.length} Entries found</li>
            <li>{entries.length - errors.length} Title case entries found</li>
            <li>{errors.length} without title case entries found</li>
          </ul>

          <button className="btn-toggle-advanced" onClick={this.handleButton}>
            Correct errors
          </button>
        </div>

        {this.state.showAdvancedSettings &&
          entries.length > 0 && (
            <div className="corrections-table">
              <p>Select options to correct the errors:</p>
              <table>
                <tbody>
                  <tr>
                    <th>Current</th>
                    <th>Title case</th>
                    <th>Sentence case</th>
                  </tr>
                </tbody>
                {entries.map(entry => (
                  <tbody key={entry.id}>
                    <tr>
                      <td className={errors.includes(entry.id) ? 'table-entry-neither' : 'table-entry-titleCase'}>
                        <input
                          name={`radio-${entry.id}`}
                          type="radio"
                          // onChange={() => this.removeCorrectedElement(entry.id)}
                        />
                        {entry.TITLE}
                        {/* {entries.find(entry => entry.id === id).TITLE} */}
                      </td>
                      <td className="table-entry-titleCase">
                        <input
                          name={`radio-${entry.id}`}
                          type="radio"
                          // onChange={() =>
                          //   this.addCorrectedTitleElement(
                          //     this.getCorrectedTitleCase(entry.id)
                          //   )
                          // }
                        />
                        {this.getCorrectedTitleCase(entry.id).TITLE}
                      </td>
                      <td className="table-entry-sentenceCase">
                        <input
                          name={`radio-${entry.id}`}
                          type="radio"
                          // onChange={() =>
                          //   this.addCorrectedSentencesElement(
                          //     this.getCorrectedSentenceCase(entry.id)
                          //   )
                          // }
                        />
                        {this.getCorrectedSentenceCase(entry.id).TITLE}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
              <button onClick={this.handleSaveSelection}>
                Accept selection
              </button>
              <button>Set all to title case</button>
              <button>Set all to sentence case</button>
            </div>
          )}
      </div>
    );
  }
}
export default CapitalizationCheck;
