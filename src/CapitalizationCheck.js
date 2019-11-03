import React, { Component } from "react";

class CapitalizationCheck extends Component {
  state = {
    showAdvancedSettings: false,
    correctedElements: []
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

  handleButton = () => {
    this.setState(prevState => ({
      showAdvancedSettings: !prevState.showAdvancedSettings
    }));
  };

  addCorrectedElement = selectedEntry => {
    const filteredcorrectedElements = this.state.correctedElements.filter(
      element => element.entryId !== selectedEntry.entryId
    );
    filteredcorrectedElements.push(selectedEntry);
    this.setState({
      correctedElements: filteredcorrectedElements
    });
  };

  removeCorrectedElement = id => {
    const filteredcorrectedElements = this.state.correctedElements.filter(
      element => element.entryId !== id
    );
    this.setState({
      correctedElements: filteredcorrectedElements
    });
  };

  handleSaveSelection = () => {
    console.log(this.state.correctedElements);
  };

  render() {
    const { entries, errors, corrections } = this.props;

    return (
      <div>
        <h3>Summary</h3>
        <ul>
          <li>{entries.length} Entries found</li>
          <li>{entries.length - errors.length} Title case entries found</li>
          <li>{errors.length} without title case entries found</li>
        </ul>

        <button className="btn-toggle-advanced" onClick={this.handleButton}>
          Manual Selection
        </button>
        <button className="btn-toggle-advanced">Set all to title case</button>

        {this.state.showAdvancedSettings && (
          <div>
            <table>
              <tbody>
                <tr>
                  <th>Current</th>
                  <th>Title case</th>
                  <th>Sentence case</th>
                </tr>
              </tbody>
              {errors.map(id => (
                <tbody key={id}>
                  <tr>
                    <td>
                      <input
                        name={`radio-${id}`}
                        type="radio"
                        onChange={() => this.removeCorrectedElement(id)}
                      />
                      {entries.find(entry => entry.id === id).title}
                    </td>
                    <td>
                      <input
                        name={`radio-${id}`}
                        type="radio"
                        onChange={() =>
                          this.addCorrectedElement(
                            this.getCorrectedTitleCase(id)
                          )
                        }
                      />
                      {this.getCorrectedTitleCase(id).title}
                    </td>
                    <td>
                      <input
                        name={`radio-${id}`}
                        type="radio"
                        onChange={() =>
                          this.addCorrectedElement(
                            this.getCorrectedSentenceCase(id)
                          )
                        }
                      />
                      {this.getCorrectedSentenceCase(id).title}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
            <button onClick={this.handleSaveSelection}>Accept selection</button>
          </div>
        )}
      </div>
    );
  }
}
export default CapitalizationCheck;
