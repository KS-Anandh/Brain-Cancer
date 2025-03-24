import { useState } from "react";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      const base64Image = reader.result.split(",")[1]; // Remove metadata part

      // Send to Roboflow API
      const response = await fetch(
        "https://detect.roboflow.com/infer/workflows/anandh/detect-count-and-visualize-2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: "ipcmWD2RYZYX8jWg9zTL",
            inputs: {
              image: { type: "base64", value: base64Image },
            },
          }),
        }
      );

      const result = await response.json();
      console.log(result);
      setResponseData(result.outputs[0]["output_image"].value);
      setLoading(false);
    };
  };

  return (
    <div  className="container">
      {/* Navbar */}
      <div className="navbar">
        <div className="nav-title">Brain Cancer Detection</div>
        <div className="nav-college">Kuppam Engineering College</div>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <h2>Select an Image for Detection</h2>
        <input type="file" accept="image/*" className="file-input" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Predict"}
        </button>

        {/* Loading Effect */}
        {loading && <p className="loading-text">Processing Image, Please Wait...</p>}
      </div>

      {/* Result Image */}
      {responseData && (
        <div className="image-container">
          <h3>Processed Image</h3>
          <img src={`data:image/png;base64,${responseData}`} alt="Processed" className="result-image" />
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        Team Guide: <span style={{color:"orangered"}}>Sathiyavani MTech</span> <br />
        Team Leader: <span style={{color:"orangered"}}>S Anandh</span> <br />
        Team Members: <span style={{color:"orangered"}}>Parvez, D Chandu, M Likitha</span>
      </div>
    </div>
  );
};

export default App;
