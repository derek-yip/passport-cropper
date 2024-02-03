import "./modal.css";

import {
  FaRegWindowClose,
  FaCloudDownloadAlt,
  FaGrin,
} from "react-icons/fa";

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
            <button onClick={props.printPassportPhoto}>
              <FaGrin />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
