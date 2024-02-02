import React, { useState, useRef, useEffect } from "react";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./components/cropper/cropper.css";

import Modal from "./components/modal/modal";

import {
  FaCropAlt,
  FaTrashAlt,
  FaRedo,
  FaSync,
  FaExpand,
  FaCompressArrowsAlt,
  FaGripLines,
  FaGripLinesVertical,
} from "react-icons/fa";

const CropperComponent = () => {
  const fileInputRef = useRef(null);

  const [backupImage, setbackupImage] = useState("./testing.jpeg");
  const [image, setImage] = useState(backupImage);

  const cropperRef = useRef(null);
  const [cropper, setcropper] = useState(null);
  const [cropperPosistion, setCropperPosition] = useState({
    top: null,
    left: null,
    height: null,
    width: null,
  });

  const [dragMode, setDragMode] = useState("none");
  const [crop, setCrop] = useState(false);
  const [cropData, setCropData] = useState(null);
  const [toggleFlip, setToggleFlip] = useState(false);
  const [ToggleHorizontalFlip, setToggleHorizontalFlip] = useState(false);
  const [ToggleVerticalFlip, setToggleVerticalFlip] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [rotateLeft, setRotateLeft] = useState(false);
  const [rotateRight, setRotateRight] = useState(false);

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
    if (cropper) {
      setcropper(null);
    }
  };

  const setDefaultCropper = () => {
    setcropper(cropperRef.current?.cropper);
    setDefaultCropperButton();
  };

  const setDefaultCropperButton = () => {
    if (cropper) {
      const cropperPosistion = cropper.cropBoxData;

      setCropperPosition({
        top: Math.floor(cropperPosistion.top),
        left: Math.floor(cropperPosistion.left),
        height: Math.floor(cropperPosistion.height),
        width: Math.floor(cropperPosistion.width),
      });
    }
  };

  useEffect(() => {
    setDefaultCropperButton();
  }, [cropper]);

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

  const handleCrop = (event) => {
    setCrop(true);
    if (cropper) {
      var croppedCanvas = cropper.getCroppedCanvas();

      setCropData(croppedCanvas.toDataURL());
      setModalOpen(true);
    }
  };

  const handleRotatedLeft = (event) => {
    event.preventDefault();
    setRotateLeft(true);
  };

  const handleRotatedRight = (event) => {
    event.preventDefault();
    setRotateRight(true);
  };

  const handleEnlarge = (event) => {
    event.preventDefault();
    cropper.zoom(0.2);
  };

  const handleCompress = (event) => {
    event.preventDefault();
    cropper.zoom(-0.2);
  };

  useEffect(() => {
    let rotateLeftTimer, rotateRightTimer;

    if (cropper && rotateLeft) {
      rotateLeftTimer = setInterval(() => {
        cropper.rotate(-5);
      }, 100);
    }

    if (cropper && rotateRight) {
      rotateRightTimer = setInterval(() => {
        cropper.rotate(5);
      }, 100);
    }

    return () => {
      clearInterval(rotateLeftTimer);
      clearInterval(rotateRightTimer);
    };
  }, [rotateLeft, rotateRight]);

  const stopRotated = () => {
    setRotateLeft(false);
    setRotateRight(false);
  };

  const handleFlipHorizontal = () => {
    setToggleHorizontalFlip(!ToggleHorizontalFlip);
  };

  const handleFlipVertical = () => {
    setToggleVerticalFlip(!ToggleVerticalFlip);
  };

  const handleToggleFlip = () => {
    setToggleFlip(!toggleFlip);
  };

  useEffect(() => {
    if (cropper) {
      var croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const targetImage = toggleFlip
          ? horizontalFlipCanvas(croppedCanvas)
          : croppedCanvas;

        setCropData(targetImage.toDataURL());
      }
    }
  }, [toggleFlip]);

  useEffect(() => {
    if (cropper) {
      if (ToggleVerticalFlip) {
        cropper.scale(1).scale(1, -1);
      }
      ToggleHorizontalFlip ? cropper.scale(1, -1) : cropper.scale(1);
    }
  }, [ToggleHorizontalFlip]);

  useEffect(() => {
    if (cropper) {
      if (ToggleHorizontalFlip) {
        cropper.scale(1).scale(-1, 1);
      }
      ToggleVerticalFlip ? cropper.scale(-1, 1) : cropper.scale(1);
    }
  }, [ToggleVerticalFlip]);
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

  const handleReset = () => {
    setImage(null);
    setCropData(null);
    setCrop(false);
    handleRotatedReset();
  };

  const handleRotatedReset = (event) => {
    if (cropper) {
      cropper.reset();
      setcropper(null);
    }
    setDefaultCropper();

    // handle Flip Vertical and Horizontal
    setToggleHorizontalFlip(false);
    setToggleVerticalFlip(false);
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
              movable={true}
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
                <button className="crop-button" onClick={handleCrop}>
                  <FaCropAlt />
                </button>
                <button className="trash-button" onClick={handleReset}>
                  <FaTrashAlt />
                </button>
                <button
                  className="rotate-left-button"
                  onMouseDown={handleRotatedLeft}
                  onMouseUp={stopRotated}
                  onMouseLeave={stopRotated}
                >
                  <FaRedo />
                </button>
                <button
                  className="rotate-right-button"
                  onMouseDown={handleRotatedRight}
                  onMouseUp={stopRotated}
                  onMouseLeave={stopRotated}
                >
                  <FaRedo />
                </button>
                <button
                  className="rotate-reset-button"
                  onClick={handleRotatedReset}
                >
                  <FaSync />
                </button>
              </div>
            )}
            {image && (
              <div
                className="cropper-button-container-bottom"
                style={{
                  top: `${cropperPosistion.top + 5}px`,
                  left: `${cropperPosistion.left}px`,
                }}
              >
                <button
                  className="image-enlarge-button"
                  onClick={handleEnlarge}
                >
                  <FaExpand />
                </button>
                <button
                  className="image-compress-button"
                  onClick={handleCompress}
                >
                  <FaCompressArrowsAlt />
                </button>
                <button
                  className="flip-horizontal-button"
                  onClick={handleFlipHorizontal}
                >
                  <FaGripLines />
                </button>
                <button
                  className="flip-vertical-button"
                  onClick={handleFlipVertical}
                >
                  <FaGripLinesVertical />
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

      <Modal
        isOpen={modalOpen}
        heading={`Preview`}
        showBottom={true}
        toggleFlip={toggleFlip}
        setClose={() => setModalOpen(false)}
        handleDownload={() => handleDownload()}
        handleToggleFlip={() => handleToggleFlip()}
      >
        {cropData && (
          <>
            <img
              className="modal-image-preview"
              src={cropData}
              alt="Modal Image"
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default CropperComponent;
