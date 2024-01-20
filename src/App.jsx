import Logo from "/logo.svg";
import "./App.css";
import { useRef, useState } from "react";
import './components/photoDropArea/index.css'

function App() {
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
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
        <div>
          <div
            ref={dropAreaRef}
            className="drop-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {imageSrc ? (
              <img src={imageSrc} alt="Uploaded" width="300" height="200" />
            ) : (
              <h2>Drop an image here to upload</h2>
            )}
          </div>

          <form style={{ display: "none" }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
            <input type="submit" value="Upload" />
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
