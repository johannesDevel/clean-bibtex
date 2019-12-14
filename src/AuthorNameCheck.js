import React, { Component } from "react";

class AuthorNameCheck extends Component {
  state = {};

  getAbbreviatedAuthorSum = () =>
    this.props.entries.filter(entry => entry.authorAbbreviation).length;

  render() {
    const { entries } = this.props;

    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{this.props.entries.length} entries found</li>
            <li>
              {this.getAbbreviatedAuthorSum()} entries with abbreviated author
              names found
            </li>
          </ul>
        </div>
        {this.getAbbreviatedAuthorSum() > 0 && (
          <div className="corrections-table">
            <table>
              <tbody>
                <tr>
                  <th>Error</th>
                  <th>Current Author name</th>
                  <th>Corrected Author name</th>
                </tr>
              </tbody>
              {entries
                .filter(entry => entry.authorAbbreviation)
                .map(entry => (
                  <tbody key={entry.id}>
                    <tr>
                      <td>
                        {entry.authorAbbreviation && "abbreviated author name"}
                      </td>
                      <td>{entry.AUTHOR}</td>
                      <td></td>
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
export default AuthorNameCheck;
