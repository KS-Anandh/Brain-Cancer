import { useState } from "react";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [cancerName, setCancerName] = useState(null);
  const [patient, setPatient] = useState(null);
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
       try{
        const result = await response.json();
        setCancerName(result.outputs[0]["predictions"]["predictions"][0].class);
        setResponseData(result.outputs[0]["output_image"].value);
        setLoading(false);
       }
       catch{
        setLoading(false);
       }
     
      
    };
  };

  return (
    <div className="container">
      <div className="navbar">
        <div className="nav-title">
          <h4>Early Brain Cancer Detection</h4>
        </div>
        <div className="nav-college">
          <img src="src\assets\logo (3).png" alt="" />
          <div>
            <h2>Kuppam Engineering College</h2>
            <p>(UGC-AUTONOMOUS)</p>
          </div>
        </div>
      </div>

      {!cancerName && (
        <div className="upload-section">
          <h3>Select an Image for Detection</h3>
          <input
            className="mail-input"
            type="text"
            placeholder="Patient Name (Optional)"
            onChange={(e) => {
              setPatient(e.target.value);
            }}
          />

          <input
            type="file"
            accept="image/*"
            className="file-input"
            onChange={handleFileChange}
          />
          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Processing..." : "Predict"}
          </button>

          {/* Loading Effect */}
          {loading && (
            <p className="loading-text">Processing Image, Please Wait...</p>
          )}
         
            <p >Upload New One, No Tumers</p>
         
        </div>
      )}

      {/* Result Image */}
      {responseData && (
        <div className="image-container">
          <h3>Processed Image</h3>
          <img
            src={`data:image/png;base64,${responseData}`}
            alt="Processed"
            className="result-image"
          />
        </div>
      )}
      {cancerName && (
        <div className="cancerIntructions" style={{margin:"40px 0px 0px 0px"}}>
          {/* Hi, you are affected by meningioma brain cancer. Don't worry, please follow these instructions. */}
          <h2>
            Hi <span style={{color:"orangered"}} >{patient}</span> you are affected by <span style={{color:"orangered"}} >{cancerName}</span> Brain Cancer. Don't worry, Please follow these instructions.
          </h2>
        </div>
      )}

      {cancerName && cancerName == "glioma" ? (
        <div className="cancerIntructions">
          <ul>
            <li>
              Follow Your Treatment Plan – Attend all radiation, chemotherapy,
              and follow-up sessions.
            </li>
            <li>
              Take Medications as Prescribed – Use steroids (e.g.,
              dexamethasone) to reduce swelling and anti-seizure drugs if
              needed.
            </li>
            <li>
              Maintain a Healthy Diet – Eat anti-inflammatory foods (fruits,
              vegetables, omega-3-rich foods).
            </li>
            <li>Stay Hydrated – Helps manage chemotherapy side effects.</li>
            <li>
              Rest and Sleep Well – Fatigue is common; prioritize proper sleep.
            </li>
            <li>
              Physical Activity – Gentle exercise (like walking) helps maintain
              mobility.
            </li>
            <li>
              Watch for Symptoms – Report new headaches, vision changes, or
              speech issues immediately.
            </li>
          </ul>
        </div>
      ) : (
        <></>
      )}
      {cancerName && cancerName == "meningioma" ? (
        <div className="cancerIntructions">
          <ul>
            <li>
              Adhere to Treatment Plan – Follow post-surgery or radiation
              therapy schedules.
            </li>
            <li>
              Monitor Symptoms – Watch for changes in vision, headaches, or limb
              weakness.
            </li>
            <li>MRI Follow-Ups – Regular scans to check for tumor regrowth.</li>
            <li>Manage Swelling – Take prescribed steroids if advised.</li>
            <li>
              Pain Management – Use medications for headaches or nerve pain.
            </li>
            <li>
              Stay Active – Light physical therapy helps with mobility and
              strength.
            </li>
            <li>
              Report Any New Symptoms – Sudden dizziness, seizures, or speech
              issues need urgent attention.
            </li>
          </ul>
        </div>
      ) : (
        <></>
      )}
       {cancerName && cancerName == "Pituitary" ?
       <div className="cancerIntructions">
        <ul>
          <li>Follow Medication Plan – Take hormone therapy (dopamine agonists for prolactinomas) as prescribed.</li>
          <li>Regular Hormone Tests – Monitor pituitary hormone levels periodically.</li>
          <li>Attend All MRI Scans – Track tumor size and potential regrowth.</li>
          <li>Watch for Vision Changes – Report blurriness or double vision immediately.</li>
          <li>Monitor Weight & Metabolism – Pituitary tumors can affect metabolism and energy levels.</li>
          <li>Avoid Skipping Medication – Stopping suddenly can cause serious health effects.</li>
          <li>Manage Stress – Stress can worsen hormonal imbalances, so practice relaxation techniques.</li>
        </ul>
       </div> 
       :<></>}
    

      {cancerName && (
        <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",alignItems:"center",columnGap:"10px"}}>
        <button
          className="upload-button"
          onClick={() => {
            setCancerName(null);
            setResponseData(null);
          }}
          style={{ width: "300px", margin:"30px 0px" }}
        >
          Upload Another
        </button>
         <button
         className="upload-button"
         onClick={() => {
          window.print();
         }}
         style={{ width: "300px", margin:"30px 0px" }}
       >
        Print Document
       </button>
       </div>
      )}

      {/* Footer */}
      <div className="footer">
        Team Guide:{" "}
        <span style={{ color: "orangered" }}>Sathiyavani MTech</span> <br />
        Team Leader: <span style={{ color: "orangered" }}>S Anandh</span> <br />
        Team Members:{" "}
        <span style={{ color: "orangered" }}>Parvez, D Chandu, M Likitha</span>
      </div>
    </div>
  );
};

export default App;
