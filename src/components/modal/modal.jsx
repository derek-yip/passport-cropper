import "./modal.css";

import {
  FaRegWindowClose,
  FaCloudDownloadAlt,
  FaCameraRetro,
} from "react-icons/fa";

import LayoutFormats from "../../assets/layoutFormat";
import { useState } from "react";

function Modal(props) {
  const [aspectRatio, setAspectRatio] = useState("4 / 5");
  if (!props.isOpen) {
    return;
  }

  const CovertToPassportPhoto = (layout) => {
    props.CovertToPassportPhoto(layout);
    if (layout === LayoutFormats.FOUR_TWO) setAspectRatio("4 / 2");
    else if (layout === LayoutFormats.THREE_TWO) setAspectRatio("3 / 2");
    else if (layout === LayoutFormats.TWO_TWO) setAspectRatio("1 / 1");
    else {
      setAspectRatio("4 / 5")
      props.handleCrop()
    }
  };

  return (
    <div className={`modal`}>
      <div className="modal-content">
        <button className="modal-close" onClick={props.setClose}>
          <FaRegWindowClose />
        </button>
        {props.heading && <h2>{props.heading}</h2>}

        <div className="modal-content-inner">
          {props.cropData && (
            <>
              <img
                className="modal-image-preview"
                style={{aspectRatio:`${aspectRatio}`}}
                src={props.cropData}
                alt="Modal Image"
              />
              <div id="previewContainer"></div>
            </>
          )}
        </div>

        {props.showBottom && (
          <div className="bottom-button-container">
            <button onClick={props.handleDownload}>
              <FaCloudDownloadAlt />
            </button>
            <button onClick={() => CovertToPassportPhoto(LayoutFormats.ONE_ONE)}>
              <FaCameraRetro />
            </button>
            <button
              onClick={() => CovertToPassportPhoto(LayoutFormats.FOUR_TWO)}
            >
              4x4
            </button>
            <button
              onClick={() => CovertToPassportPhoto(LayoutFormats.THREE_TWO)}
            >
              3x2
            </button>
            <button
              onClick={() => CovertToPassportPhoto(LayoutFormats.TWO_TWO)}
            >
              2x2
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
