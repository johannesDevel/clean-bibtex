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
      console.log("checkboxes size: " + this.props.optionsCheckboxes.length);
      this.props.changeSelectedCapitalization(capitalizationType);
      this.setState({
        allSelected: false
      });
    }
  };

  render() {
    const { entries, optionsCheckboxes } = this.props;

    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{entries.length} Entries found</li>
            {/* <li>{categories.titleCase.length} Title case entries found</li>
            <li>
              {categories.sentenceCase.length} Sentence case entries found
            </li>
            <li>
              {categories.caseNotFound.length} without known case found
            </li> */}
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
              onClick={() => this.changeSelected("noCaseFound")}
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
                        entry.capitalization === 'titleCase'
                        ? "table-entry-titleCase"
                        : entry.capitalization === 'sentenceCase'
                        ? "table-entry-sentenceCase"
                        : "table-entry-neither"
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
                    <td className="table-entry-titleCase">
                      {entry.correctionTitleCase}
                    </td>
                    <td className="table-entry-sentenceCase">
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
