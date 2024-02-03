import React, { useState, useRef, useEffect } from "react";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./components/cropper/cropper.css";

import {
  FaCropAlt,
  FaTrashAlt,
  FaRedo,
  FaSync,
  FaGripLines,
  FaGripLinesVertical,
} from "react-icons/fa";

import { IoIosContract, IoIosExpand } from "react-icons/io";
function ReactCropper() {
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
  const [UnconvertData, setUnconvertData] = useState(null);

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

  const printPassportPhoto = () => {
    // Calculate the width and height of each image piece
    var pieceWidth = 3000 / 4;
    var pieceHeight = 2100 / 2;

    // Create a new canvas element
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    // Set the canvas dimensions to match the layout of the images
    canvas.width = pieceWidth * 4;
    canvas.height = pieceHeight * 2;
    // Loop through the images and draw them on the canvas
    for (var y = 0; y < 2; y++) {
      for (var x = 0; x < 4; x++) {
        // Draw the image on the canvas
        var xPos = x * pieceWidth;
        var yPos = y * pieceHeight;
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
  return <div>cropper</div>;
}

export default ReactCropper;
