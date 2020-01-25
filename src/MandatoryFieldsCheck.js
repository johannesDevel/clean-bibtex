import React, { Component } from "react";

class MandatoryFieldsCheck extends Component {
  state = {};

  getMissingFieldsEntries = () =>
    this.props.entries.filter(entry => entry.missingRequiredFields.length > 0)
      .length;

  getCorrectedAttributeEntry = option =>
    this.props.entries
      .filter(entry => entry.id === option.entryId)
      .find(entry => entry[option.field.toUpperCase()]);

  getCorrectedAttributeField = option => {
    const entry = this.getCorrectedAttributeEntry(option);
    if (entry != null) {
      const field = entry[option.field.toUpperCase()];
      if (option.field === 'author' && field.length > 0) {
        return field.map(attribute => (
        <div key={attribute}>{attribute}</div>
        ))
      } else {
        return field;
      }
    } else {
      return '-'
    }
  }


  getTableClassName = option =>
    this.getCorrectedAttributeEntry(option) != null
      ? "table-entry-green"
      : option.suggestion.length > 0
      ? "table-entry-blue"
      : "table-entry-red";

  render() {
    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{this.props.entries.length} entries found</li>
            <li>
              {this.getMissingFieldsEntries()} entries with missing required
              fields found
            </li>
          </ul>
        </div>
        {this.getMissingFieldsEntries() > 0 && (
          <div className="corrections-table">
            <button onClick={() => this.props.changeFieldSuggestion()}>
              Search suggestion online
            </button>
            <button onClick={() => this.props.addMissingField()}>
              Add suggestion to field
            </button>
            <button
              onClick={() => console.log(this.props.missingFieldsOptions)}
            >
              show options
            </button>
            <button onClick={() => console.log(this.props.entries)}>
              show entries
            </button>
            <table>
              <tbody>
                <tr>
                  <th>Missing field name</th>
                  <th>Corrected field</th>
                  <th>Suggestion</th>
                  <th>Title</th>
                </tr>
              </tbody>
              {this.props.missingFieldsOptions.map(option => (
                <tbody key={`${option.entryId}+${option.field}`}>
                  <tr>
                    <td className={this.getTableClassName(option)}>
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={() =>
                          this.props.changeMissingFieldsOption(option)
                        }
                      />
                      <span>{option.field}</span>
                    </td>
                    <td className={this.getTableClassName(option)}>
                      {this.getCorrectedAttributeField(option)}
                    </td>
                    <td className={this.getTableClassName(option)}>
                      {option.suggestion.map(suggestionField => (
                        <div key={suggestionField}>{suggestionField}</div>
                      ))}
                    </td>
                    <td className={this.getTableClassName(option)}>
                      {
                        this.props.entries.find(
                          entry => entry.id === option.entryId
                        ).TITLE
                      }
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
export default MandatoryFieldsCheck;
