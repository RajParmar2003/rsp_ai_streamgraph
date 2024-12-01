import React, { Component } from "react";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      jsonData: null, // New state to store the parsed JSON data
    };
  }

  handleFileSubmit = (event) => {
    event.preventDefault();
    const { file } = this.state;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const json = this.csvToJson(text);
        this.setState({ jsonData: json }); // Set JSON to state
        this.props.set_data(json);
      };
      reader.readAsText(file);
    }
  };

  csvToJson = (csv) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",");
      if (currentLine.length === headers.length) {
        const obj = {};
        headers.forEach((header, index) => {
          const value = currentLine[index]?.trim();
          obj[header.trim()] =
            header.trim() === "Date"
              ? new Date(value) // Parse dates
              : isNaN(value)
              ? value // Keep strings as-is
              : +value; // Convert numbers
        });
        result.push(obj);
      }
    }

    return result;
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: 20,
          width: "100%", // Make it span across the entire top
          textAlign: "center", // Center the content inside
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
        }}
      >
        <h2>Upload a CSV File</h2>
        <form onSubmit={this.handleFileSubmit}>
          <input
            type="file"
            accept=".csv"
            onChange={(event) => this.setState({ file: event.target.files[0] })}
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default FileUpload;
