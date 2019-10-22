import React, { Component } from "react";

class CapitalizationCheck extends Component {

  getEntryTitle = (id) => {
    return this.props.entries.map((entry) => {
      if (entry.id === id) {
        return entry.title;
      }
    })
  }

  getCorrectionTitleCase = (id) => {
    return this.props.corrections.map((correction) => {
      if (correction.id === id) {
        return correction.title;
      }
    })
  }

  render() {
    const { error, entriesSum, entries, corrections } = this.props;

    return (
      <div>
        <h2>Statistic</h2>
        <ul>
          <li>{entriesSum} Entries found</li>
          <li>
            {entriesSum - error.errorEntries.length} Title case entries found
          </li>
          <li>{error.errorEntries.length} without title case entries found</li>
        </ul>

        <table border="1">
          <tr>
            <th>Current</th>
            <th>Title case</th>
            <th>Sentence case</th>
            <th>Apply change</th>
          </tr>

          {error.errorEntries.map(id => (
            <tr>
              <td>{this.getEntryTitle(id)}</td>
              <td>{this.getCorrectionTitleCase(id)}</td>
              <td>{this.getCorrectionTitleCase(id)}</td>
              <td></td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}
export default CapitalizationCheck;
