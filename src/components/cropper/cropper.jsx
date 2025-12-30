import React, { useState, useEffect, forwardRef } from "react";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./cropper.css";

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

const Cropper_ = forwardRef(function Cropper_(props, ref) {
  const [cropperKey, setCropperKey] = useState(0);
  const [cropper, setcropper] = useState(null);
  const [cropperPosistion, setCropperPosition] = useState({
    top: null,
    left: null,
    height: null,
    width: null,
  });

  const [backupImage, setbackupImage] = useState("./demo.jpeg");
  const [image, setImage] = useState(backupImage);

  const [dragMode, setDragMode] = useState("none");
  const [crop, setCrop] = useState(false);

  const [ToggleHorizontalFlip, setToggleHorizontalFlip] = useState(false);
  const [ToggleVerticalFlip, setToggleVerticalFlip] = useState(false);

  const [rotateLeft, setRotateLeft] = useState(false);
  const [rotateRight, setRotateRight] = useState(false);

  const [ToggleScrollLock, setToggleScrollLock] = useState(false);

  window.addEventListener("resize", () => {
    if (cropper) {
      cropper.reset();
      onCropperMove();
    }
  });

  const setDefaultCropper = () => {
    setcropper(ref.current?.cropper);
    setDefaultCropperButton();
  };

  const setDefaultCropperButton = () => {
    if (cropper) {
      const cropperPosistion = cropper.cropBoxData;

      setCropperPosition({
        top: Math.floor(cropperPosistion?.top),
        left: Math.floor(cropperPosistion?.left),
        height: Math.floor(cropperPosistion?.height),
        width: Math.floor(cropperPosistion?.width),
      });
    }
  };

  useEffect(() => {
    setDefaultCropperButton();
  }, [cropper]);

  useEffect(() => {
    setCropperKey(cropperKey + 1);
  }, [cropper?.url]);

  const onCropperMove = () => {
    const cropper = ref.current?.cropper;
    const cropperPosistion = cropper.getCropBoxData();

    setCropperPosition({
      top: Math.floor(cropperPosistion?.top),
      left: Math.floor(cropperPosistion?.left),
      height: Math.floor(cropperPosistion?.height),
      width: Math.floor(cropperPosistion?.width),
    });
  };

  const handleCrop = () => {
    setCrop(true);
    if (cropper) {
      var croppedCanvas = cropper.getCroppedCanvas();

      props.setCropData(croppedCanvas.toDataURL());
      props.setUnconvertData(croppedCanvas);
      props.setModalOpen(true);
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

  const handleReset = () => {
    props.setImage(null);
    props.setCropData(null);
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
    <div className="cropper-container">
      <Cropper
        className="cropper"
        ref={ref}
        key={cropperKey}
        alt="Cropper"
        src={props.image}
        ready={setDefaultCropper}
        initialAspectRatio={3 / 4}
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
            <button className="scroll-lock-button" onClick={handleScrollLock}>
              {ToggleScrollLock ? <FaLockOpen /> : <FaLock />}
            </button>

            <button className="image-enlarge-button" onClick={handleEnlarge}>
              <IoIosExpand />
            </button>
            <button className="image-compress-button" onClick={handleCompress}>
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
  );
});

export default Cropper_;
