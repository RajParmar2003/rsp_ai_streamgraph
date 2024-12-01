import React, { Component } from "react";
import FileUpload from "./components/FileUpload";
import Streamgraph from "./components/Streamgraph";
import Legend from "./components/Legend";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // Parsed JSON data from the uploaded CSV
    };
  }

  setData = (jsonData) => {
    this.setState({ data: jsonData });
  };

  render() {
    const colors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"];
    const models = ["GPT-4", "Gemini", "PaLM-2", "Claude", "LLaMA-3.1"];
    const { data } = this.state;

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
        {/* File Upload */}
        <FileUpload set_data={this.setData} />
        
        {/* Streamgraph and Legend */}
        {data.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "50px", // Adjust spacing between components
              marginTop: "20px",
            }}
          >
            <Streamgraph data={data} colors={colors} />
            <Legend models={models} colors={colors} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
