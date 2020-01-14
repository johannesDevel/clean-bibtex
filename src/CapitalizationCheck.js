import React, { Component } from "react";

class CapitalizationCheck extends Component {
  state = {
    showAdvancedSettings: false,
    correctedElements: [],
    allSelected: false
  };

  handleButton = () => {
    this.setState(prevState => ({
      showAdvancedSettings: !prevState.showAdvancedSettings
    }));
  };

  handleSaveSelection = () => {
    console.log(this.props.options);
  };

  selectAll = () => {
    const newAllSelectedState = !this.state.allSelected;
    this.setState({
      allSelected: newAllSelectedState
    });
    this.props.changeAllOptions(newAllSelectedState);
  };

  handleChangeOption = id => {
    const optionToChange = this.props.optionsCheckboxes.find(
      option => option.id === id
    );
    optionToChange.checked = !optionToChange.checked;

    this.props.changeOption(optionToChange);
  };

  changeSelected = capitalizationType => {
    if (
      this.props.optionsCheckboxes.some(option => option.checked) ||
      this.state.allSelected
    ) {
      this.props.changeSelectedCapitalization(capitalizationType);
      this.setState({
        allSelected: false
      });
    }
  };

  getCaseSum = () => {
    const caseSum = {
      titleCaseSum: 0,
      sentenceCaseSum: 0,
      noCaseSum: 0
    };
    this.props.entries.forEach(entry => {
      if (entry.capitalization === "titleCase") caseSum.titleCaseSum++;
      else if (entry.capitalization === "sentenceCase")
        caseSum.sentenceCaseSum++;
      else caseSum.noCaseSum++;
    });
    return caseSum;
  };

  render() {
    const { entries, optionsCheckboxes } = this.props;

    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{entries.length} Entries found</li>
            {this.getCaseSum().titleCaseSum > 0 && (
              <li>{this.getCaseSum().titleCaseSum} Title case entries found</li>
            )}
            {this.getCaseSum().sentenceCaseSum > 0 && (
              <li>
                {this.getCaseSum().sentenceCaseSum} Sentence case entries found
              </li>
            )}
            {this.getCaseSum().noCaseSum > 0 && (
              <li>{this.getCaseSum().noCaseSum} without known case found</li>
            )}
          </ul>

          <button
            className="btn-toggle-advanced"
            onClick={event => this.handleButton(event)}
          >
            Correct errors
          </button>
        </div>

        {this.state.showAdvancedSettings && entries.length > 0 && (
          <div className="corrections-table">
            <button
              className="btn-select-all"
              onClick={() => this.changeSelected("titleCase")}
            >
              Set selected to title case
            </button>
            <button
              className="btn-select-all"
              onClick={() => this.changeSelected("sentenceCase")}
            >
              Set selected to sentence case
            </button>
            <button
              className="btn-select-all"
              onClick={() => this.changeSelected("initialCase")}
            >
              Set selected to initial case
            </button>
            <table>
              <tbody>
                <tr>
                  <th>
                    <input
                      type="checkBox"
                      name="select-all-checkbox"
                      checked={this.state.allSelected}
                      onChange={() => this.selectAll()}
                    />
                    Current
                  </th>
                  <th>Title case</th>
                  <th>Sentence case</th>
                </tr>
              </tbody>
              {entries.map(entry => (
                <tbody key={entry.id}>
                  <tr>
                    <td
                      className={
                        entry.capitalization === "titleCase"
                          ? "table-entry-green"
                          : entry.capitalization === "sentenceCase"
                          ? "table-entry-blue"
                          : "table-entry-red"
                      }
                    >
                      <input
                        id={entry.id}
                        type="checkBox"
                        checked={
                          optionsCheckboxes.find(
                            option => option.id === entry.id
                          ).checked
                        }
                        onChange={() => this.handleChangeOption(entry.id)}
                      />
                      {entry.TITLE}
                    </td>
                    <td className="table-entry-green">
                      {entry.correctionTitleCase}
                    </td>
                    <td className="table-entry-blue">
                      {entry.correctionSentenceCase}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        )}
      </div>
    );
  }
}
export default CapitalizationCheck;
