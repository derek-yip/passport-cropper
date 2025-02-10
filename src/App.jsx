import React, { useState, useRef, useEffect } from "react";

import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Cropper from "./components/cropper/cropper";

import "./components/photoDropArea/photoDropArea.css";
import Modal from "./components/modal/modal";

const CropperComponent = () => {
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  const [backupImage, setbackupImage] = useState("./demo.jpeg");
  const [image, setImage] = useState(backupImage);

  const [modalOpen, setModalOpen] = useState(false);

  const [cropData, setCropData] = useState(null);
  const [UnconvertData, setUnconvertData] = useState(null);

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

  const handleOpenFileInput = () => {
    if (!image) {
      fileInputRef.current.click();
    }
  };

  const handleDownload = (event) => {
    event.preventDefault()
    const downloadLink = document.createElement("a");
    downloadLink.href = cropData;
    downloadLink.download = "cropped_image.png";
    downloadLink.click();
  };

  const CovertToPassportPhoto = (format) => {
    var layout = format.layout;
    var rows = format.rows;
    var cols = format.cols;

    var photoWidth = 2100;
    var photoHeight = 1500;

    var aspectRatio = 4 / 5; // Desired aspect ratio of each photo piece

    // Calculate the piece height based on the available height
    var pieceHeight = photoHeight / rows;

    // Calculate the piece width based on the piece height and aspect ratio
    let pieceWidth = pieceHeight * aspectRatio;

    // Check if the calculated width exceeds the available width
    if (pieceWidth * cols > photoWidth) {
      pieceWidth = photoWidth / cols;
    }

    // Calculate the remaining width and height
    var remainingWidth = photoWidth - pieceWidth * cols;
    var remainingHeight = photoHeight - pieceHeight * rows;

    // Calculate the horizontal and vertical offsets to center the pieces
    // var xOffset = remainingWidth / 2;
    // var yOffset = remainingHeight / 2;

    var xOffset = 0;
    var yOffset = 0;

    // Create a new canvas element
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    // Set the canvas dimensions to match the layout of the images
    canvas.width = photoWidth - remainingWidth;
    canvas.height = photoHeight - remainingHeight;

    // Loop through the images and draw them on the canvas
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        // Calculate the position of each photo piece with center alignment
        var xPos = xOffset + j * pieceWidth;
        var yPos = yOffset + i * pieceHeight;

        // Draw the image on the canvas
        context.drawImage(UnconvertData, xPos, yPos, pieceWidth, pieceHeight);
      }
    }

    // Convert the canvas to a data URL
    setCropData(canvas.toDataURL());
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
          <Cropper
            ref={cropperRef}
            image={image}
            setImage={(val) => setImage(val)}
            setCropData={(val) => setCropData(val)}
            setUnconvertData={(val) => setUnconvertData(val)}
            setModalOpen={(val) => setModalOpen(val)}
          />
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
