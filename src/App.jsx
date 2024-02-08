import React, { useState, useRef, useEffect } from "react";

import Header from "./components/header/header";
import Footer from "./components/footer/footer";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./components/cropper/cropper.css";

import "./components/photoDropArea/photoDropArea.css";
import Modal from "./components/modal/modal";

import {
  FaCropAlt,
  FaTrashAlt,
  FaRedo,
  FaSync,
  FaLockOpen,
  FaLock,
  FaGripLines,
  FaGripLinesVertical,
} from "react-icons/fa";

import { IoIosContract, IoIosExpand } from "react-icons/io";

const CropperComponent = () => {
  const fileInputRef = useRef(null);

  const [backupImage, setbackupImage] = useState("./demo.jpeg");
  const [image, setImage] = useState(backupImage);

  const cropperRef = useRef(null);
  const [cropperKey, setCropperKey] = useState(0);
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
  const [UnconvertData, setUnconvertData] = useState(null);

  const [ToggleHorizontalFlip, setToggleHorizontalFlip] = useState(false);
  const [ToggleVerticalFlip, setToggleVerticalFlip] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [rotateLeft, setRotateLeft] = useState(false);
  const [rotateRight, setRotateRight] = useState(false);

  const [ToggleScrollLock, setToggleScrollLock] = useState(false);

  const onLoadReader = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
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

  const onCropperMove = () => {
    const cropper = cropperRef.current?.cropper;
    const cropperPosistion = cropper.getCropBoxData();

    setCropperPosition({
      top: Math.floor(cropperPosistion.top),
      left: Math.floor(cropperPosistion.left),
    });
  };

  const handleCrop = () => {
    setCrop(true);
    if (cropper) {
      var croppedCanvas = cropper.getCroppedCanvas();

      setCropData(croppedCanvas.toDataURL());
      setUnconvertData(croppedCanvas);
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
    cropper.zoom(0.1);
  };

  const handleCompress = (event) => {
    event.preventDefault();
    cropper.zoom(-0.1);
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

  const handleOpenFileInput = () => {
    if (!image) {
      fileInputRef.current.click();
    }
  };

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = cropData;
    downloadLink.download = "cropped_image.png";
    downloadLink.click();
  };

  const CovertToPassportPhoto = (format) => {
    var layout = format.layout;
    var x = format.x;
    var y = format.y;

    var defaultWidth = 3000;
    var defaultHight = 2100;

    if (layout == "TWO_TWO") {
      defaultWidth = 2100;
      defaultHight = 2100;
    }

    // Calculate the width and height of each image piece
    var pieceWidth = defaultWidth / x;
    var pieceHeight = defaultHight / y;

    // Create a new canvas element
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    // Set the canvas dimensions to match the layout of the images
    canvas.width = pieceWidth * x;
    canvas.height = pieceHeight * y;
    // Loop through the images and draw them on the canvas
    for (var i = 0; i < y; i++) {
      for (var j = 0; j < x; j++) {
        // Draw the image on the canvas
        var xPos = j * pieceWidth;
        var yPos = i * pieceHeight;
        context.drawImage(UnconvertData, xPos, yPos, pieceWidth, pieceHeight);
      }
    }

    // Convert the canvas to a data URL
    setCropData(canvas.toDataURL());
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

  const handleScrollLock = () => {
    setToggleScrollLock(!ToggleScrollLock);
    setCropperKey(cropperKey + 1);
  };

  return (
    <div className="main-container">
      <Header />

      <div
        className="dragDrop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleOpenFileInput}
        style={{
          cursor: !image ? "pointer" : "",
        }}
      >
        {!image && <h2>Drag and Drop an image here or click to browse</h2>}
        {image && (
          <div
            className="cropper-container"
            onResize={() => setCropperKey(cropperKey + 1)}
          >
            <Cropper
              className="cropper"
              ref={cropperRef}
              key={cropperKey}
              alt="Cropper"
              src={image}
              ready={setDefaultCropper}
              initialAspectRatio={4 / 5}
              dragMode={dragMode}
              zoomOnWheel={ToggleScrollLock}
              background={false}
              cropBoxResizable={false}
              rotatable={true}
              movable={true}
              cropmove={onCropperMove}
              crop={crop}
            />
            {image && cropper && (
              <>
                <div
                  className="cropper-button-container"
                  style={{
                    top: `${cropperPosistion.top}px`,
                    left: `${cropperPosistion.left}px`,
                    width: `${cropperPosistion.width}px`,
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
                    onTouchStart={handleRotatedLeft}
                    onTouchEnd={stopRotated}
                    onMouseLeave={stopRotated}
                  >
                    <FaRedo />
                  </button>
                  <button
                    className="rotate-right-button"
                    onMouseDown={handleRotatedRight}
                    onMouseUp={stopRotated}
                    onTouchStart={handleRotatedRight}
                    onTouchEnd={stopRotated}
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
                  <button
                    className="scroll-lock-button"
                    onClick={handleScrollLock}
                  >
                    {ToggleScrollLock ? <FaLockOpen /> : <FaLock />}
                  </button>

                  <button
                    className="image-enlarge-button"
                    onClick={handleEnlarge}
                  >
                    <IoIosExpand />
                  </button>
                  <button
                    className="image-compress-button"
                    onClick={handleCompress}
                  >
                    <IoIosContract />
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
              </>
            )}
          </div>
        )}
      </div>

      <input
        className="FileInputer"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
      />

      <Modal
        isOpen={modalOpen}
        showBottom={true}
        setClose={() => setModalOpen(false)}
        handleCrop={() => handleCrop()}
        handleDownload={() => handleDownload()}
        CovertToPassportPhoto={(format) => CovertToPassportPhoto(format)}
        cropData={cropData}
      />
      
      <Footer />
    </div>
  );
};

export default CropperComponent;
