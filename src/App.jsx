import React, { useState, useRef } from "react";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./components/cropper/cropper.css";

import Modal from "./components/modal/modal";

import {
  FaCropAlt,
  FaTrashAlt,
  FaRedo,
  FaSync,
  FaYandex,
} from "react-icons/fa";

const CropperComponent = () => {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("./testing.jpeg");

  const cropperRef = useRef(null);
  const [cropperPosistion, setCropperPosition] = useState({
    top: null,
    left: null,
  });

  const [dragMode, setDragMode] = useState("none");
  const [crop, setCrop] = useState(false);
  const [cropData, setCropData] = useState(null);
  const [rotateDegree, setRotateDegree] = useState(0);
  const [toggleFlip, setToggleFlip] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const onLoadReader = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    onLoadReader(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    onLoadReader(file);
    setModalOpen(true);
  };

  const onCropperMove = () => {
    const cropper = cropperRef.current?.cropper;
    const cropperPosistion = cropper.getCropBoxData();

    setCropperPosition({
      top: Math.floor(cropperPosistion.top),
      left: toggleFlip
        ? Math.abs(Math.floor(cropperPosistion.left))
        : Math.floor(cropperPosistion.left),
    });
  };

  const setDefaultCropper = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const cropperPosistion = cropper.cropBoxData;
      setCropperPosition({
        top: Math.floor(cropperPosistion.top),
        left: Math.floor(cropperPosistion.left),
      });
    }
  };

  const handleCrop = () => {
    setCrop(true);
    const cropper = cropperRef.current?.cropper;
    var croppedCanvas = cropper.getCroppedCanvas();

    setCropData(croppedCanvas.toDataURL());
    setModalOpen(true);
  };

  const handleReset = () => {
    setImage(null);
    setCropData(null);
    setCrop(false);
  };

  const handleRotatedLeft = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotate(-5);
      setRotateDegree(rotateDegree - 5);
    }
  };

  const handleRotatedRight = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotate(5);
      setRotateDegree(rotateDegree + 5);
    }
  };

  const handleRotatedReset = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotate(rotateDegree < 0 ? Math.abs(rotateDegree) : -rotateDegree);
      setRotateDegree(0);
    }
  };

  const handleToggleFlip = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      setToggleFlip(!toggleFlip);

      var croppedCanvas = cropper.getCroppedCanvas();
      const targetImage = toggleFlip
        ? horizontalFlipCanvas(croppedCanvas)
        : croppedCanvas;

      setCropData(targetImage.toDataURL());
    }
  };

  const horizontalFlipCanvas = (canvas) => {
    const flippedCanvas = document.createElement("canvas");
    const ctx = flippedCanvas.getContext("2d");

    flippedCanvas.width = canvas.width;
    flippedCanvas.height = canvas.height;

    ctx.translate(flippedCanvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(canvas, 0, 0);

    return flippedCanvas;
  };

  const handleOpenFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = cropData;
    downloadLink.download = "cropped_image.png";
    downloadLink.click();
  };

  return (
    <div className="main-container">
      <div
        className="dragDrop-area"
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
              // className={toggleFlip ? "cropper cropper-flip" : "cropper"}
              ref={cropperRef}
              alt="Cropper"
              src={image}
              ready={setDefaultCropper}
              initialAspectRatio={4 / 5}
              dragMode={dragMode}
              zoomOnWheel={false}
              background={false}
              cropBoxResizable={false}
              rotatable={true}
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
                <button className="crop-crop-button" onClick={handleCrop}>
                  <FaCropAlt />
                </button>
                <button className="crop-trash-button" onClick={handleReset}>
                  <FaTrashAlt />
                </button>
                <button
                  className="crop-rotate-left-button"
                  onClick={handleRotatedLeft}
                >
                  <FaRedo />
                </button>
                <button
                  className="crop-rotate-right-button"
                  onClick={handleRotatedRight}
                >
                  <FaRedo />
                </button>
                <button
                  className="crop-rotate-reset-button"
                  onClick={handleRotatedReset}
                >
                  <FaSync />
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
      <Modal
        isOpen={modalOpen}
        showBottom={true}
        toggleFlip={toggleFlip}
        setClose={() => setModalOpen(false)}
        handleDownload={handleDownload}
        handleToggleFlip={handleToggleFlip}
      >
        <h2>Preview</h2>
        {cropData && (
          <div>
            <img
              className="modal-image-preview"
              src={cropData}
              alt="Modal Image"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CropperComponent;
