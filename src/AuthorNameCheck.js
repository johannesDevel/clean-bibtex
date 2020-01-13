import React, { Component } from "react";
import * as BibtexAPI from "./utils/BibtexAPI";

class AuthorNameCheck extends Component {
  state = {
    options: []
  };

  componentDidMount() {
    this.setAuthorSuggestionOptions();
  }

  setAuthorSuggestionOptions = () => {
    this.setState(() => {
      const options = this.getInconsistentAuthorEntries().flatMap(entry =>
        entry.AUTHOR.filter(
          author => author.abbreviated || author.misspelling
        ).map(author => ({
          entryId: entry.id,
          title: entry.TITLE,
          author: author.name,
          suggestion: author.suggestion,
          checked: false
        }))
      );
      return {
        options: options
      };
    });
  };

  getInconsistentAuthorEntries = () =>
    this.props.entries.filter(
      entry =>
        entry.AUTHOR != null &&
        entry.AUTHOR.some(author => author.abbreviated || author.misspelling)
    );

  searchSuggestions = () => {
    // console.log(this.state.options.filter(option => option.checked));
    this.props.changeAuthorSuggestion(this.state.options.filter(option => option.checked));

    // this.setState(() => {
    //   const changedOptions = this.state.options.map(option => {
    //     console.log(option);
    //     if (option.checked) {
    //       return BibtexAPI.searchAuthor(
    //         option.title.replace(/[\s]+/g, "+"),
    //         option.author.replace(/[\s]+/g, "+")
    //       )
    //         .then(result => {
    //           if (
    //             result != null &&
    //             result.message != null &&
    //             result.message.items.length > 0
    //           ) {
    //             const firstItem = result.message.items[0];
    //             const foundAuthor = firstItem.author.find(itemAuthor =>
    //               option.author.startsWith(itemAuthor.family)
    //             );
    //             if (foundAuthor != null) {
    //               console.log(foundAuthor);
    //               const changedOption = Object.assign({}, option);
    //               const name = `${foundAuthor.family}, ${foundAuthor.given}`;
    //               changedOption.suggestion = [name];
    //             } else return option;
    //           } else return option;
    //         })
    //         .catch(() => option);
    //     } else return option;
    //   });
    //   return { options: changedOptions };
    // });
  };

  changeAuthorName = () => {
    console.log(this.state);
    this.state.options
      .filter(option => option.checked)
      .forEach(option => {
        // if (option.suggestion != null && option.suggestion.length > 0){
        this.props.changeAuthorName(option.entryId, option.author);
        // }
      });
  };

  getChecked = authorName => {
    const checkedOption = this.state.options.find(
      option => option != null && option.author === authorName
    );
    if (checkedOption != null) {
      return checkedOption.checked;
    } else {
      return false;
    }
  };

  changeOption = authorName => {
    this.setState(() => {
      const newOptions = this.state.options.map(option => {
        if (option.author === authorName) {
          return {
            entryId: option.entryId,
            title: option.title,
            author: option.author,
            suggestion: option.suggestion,
            checked: !option.checked
          };
        } else {
          return Object.assign({}, option);
        }
      });
      return { options: newOptions };
    });
  };

  showEntries = () => {
    console.log(this.props.entries[1]);
  }

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
            <button onClick={() => this.searchSuggestions()}>
              Search author suggestion
            </button>
            <button onClick={() => this.changeAuthorName()}>
              change author name to suggestion
            </button>
            <button onClick={() => this.showEntries()}>show entries</button>
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
                  {entry.AUTHOR.filter(
                    author => author.abbreviated || author.misspelling
                  ).map(author => (
                    <tr key={author.name}>
                      <td>
                        <input
                          type="checkBox"
                          checked={this.getChecked(author.name)}
                          onChange={() => this.changeOption(author.name)}
                        />
                        {author.name}
                      </td>
                      <td>
                        {author.suggestion != null &&
                        author.suggestion.length > 0
                          ? author.suggestion[0]
                          : "no suggestion found"}
                      </td>
                      <td>{entry.TITLE}</td>
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
