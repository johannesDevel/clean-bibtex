import React, { Component } from "react";

class AuthorNameCheck extends Component {
  state = {};

  render() {
    const { entries } = this.props;

    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{this.props.entries.length} entries found</li>
          </ul>
        </div>
        {true && (
          <div className="corrections-table">
            <table border="1">
              <tbody>
                <tr>
                  <th>Error</th>
                  <th>Entries</th>
                </tr>
              </tbody>
              {entries
                .map(entry => (
                  <tbody key={entry.id}>
                    <tr>
                      <td>
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
export default AuthorNameCheck;
