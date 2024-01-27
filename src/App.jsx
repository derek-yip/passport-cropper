import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FaCheck, FaTimes } from "react-icons/fa";

const CropperComponent = () => {
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ height: 0, width: 0 });

  const [cropperPosistion, setCropperPosition] = useState({ x: 0, y: 0 });

  const [cropData, setCropData] = useState(null);
  const [crop, setCrop] = useState(false);

  const [dragMode, setDragMode] = useState("none");

  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onCropperMove = () => {
    const cropper = cropperRef.current?.cropper;
    const cropperPosistion = cropper.getData();
    setCropperPosition({ x: cropperPosistion.x, y: cropperPosistion.y });
    console.log(croppedCanvas);
  };

  const handleCrop = () => {
    setCrop(true);
    const cropper = cropperRef.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas();
    setImageSize({
      height: Math.floor(croppedCanvas.height),
      width: Math.floor(croppedCanvas.width),
    });
    setCropData(croppedCanvas.toDataURL());
  };

  const handleReset = () => {
    setImage(null);
    setCropData(null);
    setCrop(false);
  };

  const handleOpenFileInput = () => {
    if (cropData != null) return;
    fileInputRef.current.click();
  };

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = cropData;
    downloadLink.download = "cropped_image.png";
    downloadLink.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        // onClick={handleOpenFileInput}
        style={{
          minHeight: "20rem",
          height: "40rem",
          padding: "20px",
          border: "2px dashed #ccc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // cursor: "pointer",
        }}
      >
        {!image && <span>Drag and drop an image here or click to browse</span>}
        {image && (
          <>
            <Cropper
              ref={cropperRef}
              src={image}
              style={{ maxHeight: "100%" }}
              initialAspectRatio={4 / 5}
              dragMode={dragMode}
              scalable={false}
              movable={false}
              crop={crop}
              guides={true}
              cropBoxResizable={false}
              zoomOnWheel={false}
              onMouseOver={onCropperMove}
            />
            {crop && (
              <div
                style={{
                  position: "absolute",
                  top: `${cropperPosistion.y}px`,
                  right: `${cropperPosistion.x}px`,
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <button onClick={handleCrop} style={{ marginRight: "10px" }}>
                  <FaCheck />
                </button>
                <button onClick={handleReset}>
                  <FaTimes />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        ref={fileInputRef}
      />

      <div className="buttonList">
        <button onClick={handleOpenFileInput}>Upload</button>
        <button onClick={handleCrop}>Crop</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      {cropData && (
        <div>
          <h2>Cropped Image Preview:</h2>
          <img src={cropData} alt="Cropped" style={{ maxHeight: "400px" }} />
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};

export default CropperComponent;
