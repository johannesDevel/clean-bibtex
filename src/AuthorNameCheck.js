import React, { Component } from "react";
import * as BibtexAPI from "./utils/BibtexAPI";

class AuthorNameCheck extends Component {
  state = {};

  getInconsistentAuthorEntries = () =>
    this.props.entries.filter(
      entry =>
        entry.AUTHOR != null &&
        entry.AUTHOR.some(author => author.abbreviated || author.misspelling)
    );

  render() {
    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{this.props.entries.length} entries found</li>
            <li>
              {this.getInconsistentAuthorEntries().length} entries with
              inconsistent author names found
            </li>
          </ul>
        </div>
        {this.getInconsistentAuthorEntries().length > 0 && (
          <div className="corrections-table">
            <button onClick={() => BibtexAPI.searchAuthor()}>
              Search Author
            </button>
            <table border="1">
              <tbody>
                <tr>
                  <th>Current Author Name</th>
                  <th>Author Name Suggestion</th>
                  <th>Entry Title</th>
                </tr>
              </tbody>
              {this.getInconsistentAuthorEntries().map(entry => (
                <tbody key={entry.id}>
                  <tr>
                    <td>
                      {entry.AUTHOR.filter(
                        author => author.abbreviated || author.misspelling
                      ).map(author => (
                        <div>
                          <input
                            id={entry.id}
                            type="checkBox"
                            onChange={() => console.log()}
                          />
                          {author.name}
                        </div>
                      ))}
                    </td>
                    <td>
                      {entry.AUTHOR.filter(
                        author => author.abbreviated || author.misspelling
                      ).map(author => (
                        <div>
                          {author.suggestion != null
                            ? author.suggestion
                            : "no suggestion found"}
                        </div>
                      ))}
                    </td>
                    <td>{entry.TITLE}</td>
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
