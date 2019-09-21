import React from "react";

const readFileAsText = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(event.target.result);
    };
    reader.readAsText(file);
  });

function FileUpload(props) {
  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      readFileAsText(file).then(text => {
        if (text.length > 3) {
          // console.log(text);
          props.setBibtex(text);
        }
      });
    }
  };

  return (
    <div className="start-upload-button">
      <label htmlFor="file">
        <br />
        <br />
        <br />
        Upload BibteX
      </label>
      <input
        id="file"
        className="input-file"
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
}
export default FileUpload;
