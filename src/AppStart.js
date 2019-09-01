import React, { Component } from 'react';


class AppStart extends Component {

  render() {
    return (
      <div className="start-wrapper">
        <div className="start">
          <div className="start-inputs">
            <textarea
              className="start-input-field"
              type="text">
            </textarea>
            <button
              className="start-upload-button"
            >Upload BibTex file
            </button>
            <button
              className="start-analyze-button"
            >Start analyzing BibTex
            </button>
          </div>
        </div>
      </div>
    )
  }


}
export default AppStart;