import React, { Component } from "react";

class MandatoryFieldsCheck extends Component {
  state = {};

  getMissingFieldsEntries = () =>
    this.props.entries.filter(entry => entry.missingRequiredFields.length > 0)
      .length;

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
            <table border="1">
              <tbody>
                <tr>
                  <th>missing required fields</th>
                  <th>Entries with missing required field</th>
                </tr>
              </tbody>
              {entries
                .filter(entry => entry.missingRequiredFields.length > 0)
                .map(entry => (
                  <tbody key={entry.id}>
                    <tr>
                      <td>
                        {entry.missingRequiredFields.map(missingField => (
                          <div>{missingField}</div>
                        ))}
                      </td>
                      <td>
                        <div>{`Type: ${entry.entryType}`}</div>
                        <div>{`Title: ${entry.TITLE}`}</div>
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
