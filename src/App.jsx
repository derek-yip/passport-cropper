import React, { useState, useRef, useEffect } from "react";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./components/cropper/cropper.css";

import { FaCheck, FaTimes } from "react-icons/fa";

const CropperComponent = () => {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);

  const cropperRef = useRef(null);
  const [cropperPosistion, setCropperPosition] = useState({ top: 0, left: 0 });
  const [dragMode, setDragMode] = useState("none");
  const [crop, setCrop] = useState(false);
  const [cropData, setCropData] = useState(null);

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
    const cropperPosistion = cropper.getCropBoxData();
    // console.log(cropper.getCropBoxData().top,cropper.getCropBoxData().left);
    if (cropperPosistion.top >= 0 && cropperPosistion.left >= 0) {
      setCropperPosition({
        top: Math.floor(cropperPosistion.top),
        left: Math.floor(cropperPosistion.left),
      });
    }
  };

  const setDefaultCropper = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const cropperPosistion = cropper.getCropBoxData();
      console.log(cropper,{
        top: Math.floor(cropperPosistion.top),
        left: Math.floor(cropperPosistion.left),
      });
      
    }
    // if (cropperPosistion.top >= 0 && cropperPosistion.left >= 0) {
    //   setCropperPosition({
    //     top: Math.floor(cropperPosistion.top),
    //     left: Math.floor(cropperPosistion.left),
    //   });
    // }
  };

  const handleCrop = () => {
    setCrop(true);
    const cropper = cropperRef.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas();
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
        style={{
          position: "relative",
          minHeight: "20rem",
          height: "40rem",
          border: "2px dashed #ccc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // cursor: "pointer",
        }}
      >
        {!image && <h2>Drag and Drop an image here or click to browse</h2>}
        {image && (
          <div className="cropper-container">
            <Cropper
              className="cropper"
              ref={cropperRef}
              src={image}
              onInitialized={handleCropperLoaded}
              initialAspectRatio={4 / 5}
              dragMode={dragMode}
              zoomOnWheel={false}
              background={false}
              guides={true}
              cropBoxResizable={false}
              // cropstart={setDefaultCropper}
              cropmove={onCropperMove}
              crop={crop}
            />
            {image && (
              <div
                className="cropper-button-container"
                style={{
                  top: `${cropperPosistion.top}px`,
                  left: `${cropperPosistion.left}px`,
                }}
              >
                <button className="crop-tick-button" onClick={handleCrop}>
                  <FaCheck />
                </button>
                <button className="crop-cross-button" onClick={handleReset}>
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
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
