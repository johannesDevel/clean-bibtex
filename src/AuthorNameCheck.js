import React, { Component } from "react";

class AuthorNameCheck extends Component {
  state = {
    allSelected: false
  };

  getInconsistentAuthorEntries = () =>
    this.props.entries.filter(
      entry =>
        entry.AUTHOR != null &&
        entry.AUTHOR.some(
          author =>
            author.abbreviated ||
            author.misspelling ||
            author.changedAbbreviation ||
            author.changedMisspelling
        )
    );

  getInconsistentAuthorEntriesCount = () =>
    this.props.entries.filter(
      entry =>
        entry.AUTHOR != null &&
        entry.AUTHOR.some(author => author.abbreviated || author.misspelling)
    );

  searchSuggestions = () => {
    this.props.changeAuthorSuggestion(
      this.props.authorNameOptions.filter(option => option.checked)
    );
  };

  selectAll = () => {
    const newAllSelectedState = !this.state.allSelected;
    this.setState({ allSelected: newAllSelectedState });
    this.props.changeAllAuthorNameOptions(newAllSelectedState);
  };

  checkCorrectedAuthors = option =>
    this.props.entries.some(
      entry =>
        entry.id === option.entryId &&
        entry.AUTHOR.some(
          entryAuthor =>
            option.author === entryAuthor.name &&
            !entryAuthor.abbreviated &&
            !entryAuthor.misspelling
        )
    );

  render() {
    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{this.props.entries.length} entries found</li>
            {this.getInconsistentAuthorEntriesCount().length > 0 && (
              <li>
                {this.getInconsistentAuthorEntriesCount().length} entries with
                inconsistent author names found
              </li>
            )}
          </ul>
        </div>
        {this.getInconsistentAuthorEntries().length > 0 && (
          <div className="corrections-table">
            <div>
              <div>
              <button className="button-author-name-check"
                onClick={() =>
                  this.setState(
                    { allSelected: false },
                    this.searchSuggestions()
                  )
                }
                disabled={
                  !this.props.authorNameOptions.some(option => option.checked)
                }
              >
                Search suggestion online
              </button>
              {/* <button className="button-author-name-check"
                onClick={() =>
                  this.setState(
                    { allSelected: false },
                    this.props.searchSuggestionFile()
                  )
                }
                disabled={
                  !this.props.authorNameOptions.some(option => option.checked)
                }
              >
                Search suggestion in file
              </button> */}
              <button className="button-author-name-check"
                onClick={() =>
                  this.setState(
                    { allSelected: false },
                    this.props.changeAuthorName('suggestion')
                  )
                }
                disabled={
                  !this.props.authorNameOptions.some(option => option.checked)
                }
              >
                Set author to file suggestion
              </button>
              <button className="button-author-name-check"
                onClick={() =>
                  this.setState(
                    { allSelected: false },
                    this.props.changeAuthorName('onlineSuggestion')
                  )
                }
                disabled={
                  !this.props.authorNameOptions.some(option => option.checked)
                }
              >
                Set author to online suggestion
              </button>
              </div>
            </div>
            <table>
              <tbody>
                <tr>
                  <th>
                    <input
                      type="checkBox"
                      name="select-all-author-name-checkbox"
                      checked={this.state.allSelected}
                      onChange={() => this.selectAll()}
                    />
                  </th>
                  <th>Current Author Name</th>
                  <th>File suggestion</th>
                  <th>Online suggestion</th>
                  <th>Entry Title</th>
                </tr>
              </tbody>
              {this.props.authorNameOptions.map(author => (
                <tbody key={`${author.entryId}+${author.author}`}>
                  <tr>
                    <td
                      className={
                        this.checkCorrectedAuthors(author)
                          ? "table-entry-green"
                          : "table-entry-red"
                      }
                    >
                      <center>
                        <input
                          type="checkBox"
                          checked={author.checked}
                          onChange={() =>
                            this.props.changeAuthorNameOption(author)
                          }
                        />
                      </center>
                    </td>
                    <td
                      className={
                        this.checkCorrectedAuthors(author)
                          ? "table-entry-green"
                          : "table-entry-red"
                      }
                    >
                      {author.author}
                    </td>
                    <td
                      className={
                        this.checkCorrectedAuthors(author)
                          ? "table-entry-green"
                          : author.suggestion.length > 0
                          ? "table-entry-blue"
                          : "table-entry-red"
                      }
                    >
                      {author.suggestion != null && author.suggestion.length > 0
                        ? author.suggestion[0]
                        : "no suggestion found"}
                    </td>
                    <td className={
                        this.checkCorrectedAuthors(author)
                          ? "table-entry-green"
                          : (author.suggestion.length > 0 || author.onlineSuggestion.length > 0)
                          ? "table-entry-blue"
                          : "table-entry-red"
                      }>
                      {author.onlineSuggestion.length > 0 ? author.onlineSuggestion[0] : 'no suggestion found'}
                      {/* {author.onlineSuggestion} */}
                    </td>
                    <td className="table-entry-grey">{author.title}</td>
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
