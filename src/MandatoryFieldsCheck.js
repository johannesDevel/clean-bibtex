import React, { Component } from "react";

class MandatoryFieldsCheck extends Component {
  state = {
    allSelected: false
  };

  selectAll = () => {
    const newAllSelectedState = !this.state.allSelected;
    this.setState({ allSelected: newAllSelectedState });
    this.props.changeAllMandatoryFieldCheck(newAllSelectedState);
  };

  render() {
    return (
      <div>
        <div className="statistic">
          <h3>Summary</h3>
          <ul>
            <li>{this.props.entries.length} entries found</li>
            <li>
              {`${
                this.props.entries.filter(
                  entry => entry.missingRequiredFields.length > 0
                ).length
              } entries with missing required fields found`}
            </li>
          </ul>
        </div>
        {this.props.entries.length > 0 && (
          <div className="corrections-table">
            <button
              onClick={() => this.props.searchMandatoryFieldSuggestion()}
              disabled={
                !this.props.entries.some(entry => entry.mandatoryFieldsCheck)
              }
            >
              Search missing fields online
            </button>
            <button
              disabled={
                !this.props.entries.some(entry => entry.mandatoryFieldsCheck)
              }
              onClick={() => {
                this.setState({ allSelected: false });
                this.props.addMissingFields();
              }}
            >
              Add field suggestion to entry
            </button>
            <button
              onClick={() => {
                this.setState({ allSelected: false });
                this.props.removeNotMandatoryFields();
              }}
              disabled={
                !this.props.entries.some(entry => entry.mandatoryFieldsCheck)
              }
            >
              Remove not mandatory fields
            </button>
            <table>
              <tbody>
                <tr>
                  <th>
                    <input
                      type="checkBox"
                      name="select-all-missing-fields-checkbox"
                      checked={this.state.allSelected}
                      onChange={() => this.selectAll()}
                    />
                  </th>
                  <th>Current entry</th>
                  <th>Suggestion for missing fields</th>
                </tr>
              </tbody>
              {this.props.entries.map(entry => (
                <tbody key={entry.id}>
                  <tr
                    className={
                      entry.missingRequiredFields.length === 0
                        ? "table-entry-green"
                        : Object.keys(entry.mandatoryFieldsSuggestions).length >
                          0
                        ? "table-entry-blue"
                        : "table-entry-red"
                    }
                  >
                    <td>
                      <input
                        type="checkBox"
                        checked={entry.mandatoryFieldsCheck}
                        onChange={() =>
                          this.props.toggleMandatorFieldCheck(entry.id)
                        }
                      />
                    </td>
                    <td>
                      {Object.keys(entry)
                        .filter(key => key === key.toUpperCase())
                        .map(key => (
                          <div key={`${entry.id}+${key}`}>
                            <strong>{key}: </strong>
                            {entry[key] == null ? (
                              "<EMPTY>"
                            ) : key === "AUTHOR" ? (
                              entry[key].map((author, index, authorArray) =>
                                index === authorArray.length - 1 ? (
                                  <span key={entry.id + author.name}>
                                    {author.name}
                                  </span>
                                ) : (
                                  <span key={entry.id + author.name}>
                                    {author.name} and{" "}
                                  </span>
                                )
                              )
                            ) : (
                              <span>{entry[key]}</span>
                            )}
                          </div>
                        ))}
                      {entry.missingRequiredFields.length > 0 && (
                        <div>
                          Missing required fields:{" "}
                          {entry.missingRequiredFields.map(field => (
                            <span
                              key={entry.id + field}
                            >{`${field.toUpperCase()}, `}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      {Object.keys(entry.mandatoryFieldsSuggestions).length > 0
                        ? Object.keys(entry.mandatoryFieldsSuggestions).map(
                            key =>
                              key === "AUTHOR" ? (
                                <div key={entry.id + key}>
                                  <strong>{key}: </strong>
                                  {entry.mandatoryFieldsSuggestions.AUTHOR.map(
                                    (author, index, authorArray) => (
                                      <span key={entry.id + author.name}>
                                        {`${author.name} ${
                                          index === authorArray.length - 1
                                            ? ""
                                            : "and "
                                        }`}
                                      </span>
                                    )
                                  )}
                                </div>
                              ) : (
                                <div key={entry.id + key}>
                                  <strong>{key}: </strong>
                                  {entry.mandatoryFieldsSuggestions[key]}
                                </div>
                              )
                          )
                        : "-"}
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
