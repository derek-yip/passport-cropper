import "./modal.css";

import {
  FaRegWindowClose,
  FaCloudDownloadAlt,
  FaCameraRetro,
} from "react-icons/fa";

import LayoutFormats from "../../assets/layoutFormat";

function Modal(props) {
  if (!props.isOpen) {
    return;
  }

  return (
    <div className={`modal`}>
      <div className="modal-content">
        <button className="modal-close" onClick={props.setClose}>
          <FaRegWindowClose />
        </button>
        {props.heading && <h2>{props.heading}</h2>}

        <div className="modal-content-inner">{props.children}</div>

        {props.showBottom && (
          <div className="bottom-button-container">
            <button onClick={props.handleDownload}>
              <FaCloudDownloadAlt />
            </button>
            <button
              onClick={() => props.handleCrop()}
            >
              <FaCameraRetro />
            </button>
            <button
              onClick={() =>
                props.CovertToPassportPhoto(LayoutFormats.FOUR_TWO)
              }
            >
              4x4
            </button>
            <button
              onClick={() =>
                props.CovertToPassportPhoto(LayoutFormats.THREE_TWO)
              }
            >
              3x2
            </button>
            <button
              onClick={() => props.CovertToPassportPhoto(LayoutFormats.TWO_TWO)}
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
