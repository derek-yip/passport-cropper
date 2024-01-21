import Logo from "/logo.svg";
import "./App.css";
import { useRef, useState } from "react";
import "./components/photoDropArea/index.css";

function App() {
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = () => {
    const file = fileInputRef.current.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <div>
        <a href="https://github.com/derek-yip/" target="_blank">
          <img src={Logo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Passport Cropper</h1>

      <div className="photoAttachContainer">
        <div
          ref={dropAreaRef}
          className="drop-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="img-container">
            {imageSrc ? (
              <img src={imageSrc} alt="Uploaded" />
            ) : (
              <h2>Drop / Click to UPLOAD an image here !</h2>
            )}
          </div>
          <div className="form-container">
            <form>
              <div className="upload-file-container">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                />
                <button className="form-upload">Upload</button>
              </div>
              <input type="submit" value="Confirm" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
