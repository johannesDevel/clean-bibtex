import React, { Component } from "react";

class AuthorNameCheck extends Component {
  state = {
    allSelected: false
  }

  getInconsistentAuthorEntries = () =>
    this.props.entries.filter(
      entry =>
        entry.AUTHOR != null &&
        entry.AUTHOR.some(
          author =>
            author.abbreviated ||
            author.misspelling ||
            author.changedAbbreviation
        )
    );

    getInconsistentAuthorEntriesCount = () =>
    this.props.entries.filter(
      entry =>
        entry.AUTHOR != null &&
        entry.AUTHOR.some(
          author =>
            author.abbreviated ||
            author.misspelling
        )
    );

  searchSuggestions = () => {
    // console.log(this.state.options.filter(option => option.checked));
    this.props.changeAuthorSuggestion(
      this.props.authorNameOptions.filter(option => option.checked)
    );
  };

  changeAuthorName = () => {
    console.log(this.state);
    this.props.authorNameOptions
      .filter(option => option.checked)
      .forEach(option => {
        this.props.changeAuthorName(option.entryId, option.author);
      });
  };

  getChecked = authorName => {
    const checkedOption = this.props.authorNameOptions.find(
      option => option != null && option.author === authorName
    );
    if (checkedOption != null) {
      return checkedOption.checked;
    } else {
      return false;
    }
  };

  selectAll = () => {
    const newAllSelectedState = !this.state.allSelected;
    this.setState(prevState => ({
      allSelected: newAllSelectedState
    }));
    this.props.changeAllAuthorNameOptions(newAllSelectedState);
  }

  render() {
    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{this.props.entries.length} entries found</li>
            <li>
              {this.getInconsistentAuthorEntriesCount().length} entries with
              inconsistent author names found
            </li>
          </ul>
        </div>
        <div>
          {[{id: 1, name: 'bastian'}, {id: 2, name: 'davis'}, {id: 0, name: 'adrian'}]
          .sort((author1, author2) => {
            return author2.id - author1.id;
          })
          .map(author => (
            <div>{author.name}</div>
          ))}
        </div>
        {this.getInconsistentAuthorEntries().length > 0 && (
          <div className="corrections-table">
            <button onClick={() => this.searchSuggestions()}>
              Search author suggestion
            </button>
            <button onClick={() => this.changeAuthorName()}>
              change author name to suggestion
            </button>
            {/* <button onClick={() => console.log(this.props.authorNameOptions)}>show options</button> */}
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
                    Current Author Name</th>
                  <th>Author Name Suggestion</th>
                  <th>Entry Title</th>
                </tr>
              </tbody>
              {this.getInconsistentAuthorEntries().map(entry => (
                <tbody key={entry.id}>
                  {entry.AUTHOR.filter(
                    author =>
                      author.abbreviated ||
                      author.misspelling ||
                      author.changedAbbreviation
                  ).map(author => (
                    <tr key={author.name}>
                      <td className={
                        author.abbreviated || author.misspelling
                        ? 'table-entry-red'
                        : 'table-entry-green'
                      }>
                        <input
                          type="checkBox"
                          checked={this.getChecked(author.name)}
                          onChange={() => this.props.changeAuthorNameOption(author.name)}
                        />
                        {author.name}
                      </td>
                      <td className={
                        author.changedAbbreviation
                        ? 'table-entry-green'
                        : this.props.authorNameOptions.find(option => option.author === author.name).suggestion.length > 0
                        ? 'table-entry-blue'
                        : 'table-entry-red'
                      }>
                        {author.suggestion != null &&
                        author.suggestion.length > 0
                          ? author.suggestion[0]
                          : "no suggestion found"}
                      </td>
                      <td className="table-entry-grey">{entry.TITLE}</td>
                    </tr>
                  ))}
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
