import React, { Component } from "react";

class MandatoryFieldsCheck extends Component {
  state = {};

  getMissingFieldsEntries = () =>
    this.props.entries.filter(entry => entry.missingRequiredFields.length > 0)
      .length;

  changeOption = option => {
    const changedOption = Object.assign({}, option);
    changedOption.checked = !changedOption.checked;
    this.props.changeMissingFieldsOption(changedOption);
  };

  render() {
    const { entries } = this.props;

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
              Search for suggestion
            </button>
            <table border="1">
              <tbody>
                <tr>
                  <th>missing required fields</th>
                  <th>suggestion</th>
                  <th>Entries with missing required field</th>
                </tr>
              </tbody>
              {entries
                .filter(entry => entry.missingRequiredFields.length > 0)
                .map(entry =>
                  entry.missingRequiredFields.map(missingField => (
                    <tbody key={`${entry.id}+${missingField}`}>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            name="ba"
                            checked={
                              this.props.missingFieldsOptions.find(
                                field =>
                                  field.entryId === entry.id &&
                                  field.field === missingField
                              ).checked
                            }
                            onChange={() =>
                              this.changeOption(
                                this.props.missingFieldsOptions.find(
                                  field =>
                                    field.entryId === entry.id &&
                                    field.field === missingField
                                )
                              )
                            }
                          />
                          <span>{missingField}</span>
                        </td>
                        <td>
                          {
                            this.props.missingFieldsOptions.find(
                              field =>
                                field.entryId === entry.id &&
                                field.field === missingField
                            ).suggestion
                          }
                        </td>
                        <td>
                          <div>{`Type: ${entry.entryType}`}</div>
                          <div>{`Title: ${entry.TITLE}`}</div>
                        </td>
                      </tr>
                    </tbody>
                  ))
                )}
            </table>
          </div>
        )}
      </div>
    );
  }
}
export default MandatoryFieldsCheck;
