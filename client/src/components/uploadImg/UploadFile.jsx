/** @format */

import { Slider, Button } from "@material-ui/core";
import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Modal from "react-modal";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import "./uploadFile.css";
import { getCroppedUrl } from "./getCroppedImg";

Modal.setAppElement("#root");

const UploadFile = ({ setCoverImg, CropObj, setStateCoverImg }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [cropFile, setCropFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const imgTag = useRef();

  const accpetImg = (type) => {
    const acceptImgTypes = ["image/png", "image/jpeg", "image/jpg"];
    return type && acceptImgTypes.includes(type);
  };

  const handleImgChange = (e) => {
    if (
      e.target.files &&
      e.target.files.length > 0 &&
      accpetImg(e.target.files[0].type)
    ) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setModalIsOpen(true);
    } else {
      //handel this error
      console.log("error");
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCropFile(croppedAreaPixels);
  }, []);

  const handelSave = async () => {
    const canvasImg = getCroppedUrl(imgTag.current, cropFile);
    setModalIsOpen(false);
    // send data to parent component
    setStateCoverImg(null);
    setCoverImg(canvasImg);
    CropObj(imgTag.current, cropFile);
  };

  const handelClose = () => {
    setModalIsOpen(false);
    setImgSrc(null);
  };
  return (
    <>
      <input
        id="upload-blog-img"
        type="file"
        accept="image/*"
        onChange={handleImgChange}
      />
      <label htmlFor="upload-blog-img" className="">
        <Button
          variant="contained"
          component="span"
          style={{
            color: "#fd784c",
            fontWeight: "bold",
            backgroundColor: "whitesmoke",
            width: "270px",
            height: "55px",
            fontSize: "1rem",
            padding: "0px",
          }}
          startIcon={<CloudUploadIcon />}
        >
          Upload cover image
        </Button>
      </label>
      <Modal isOpen={modalIsOpen} style={customStyles}>
        <div style={{ position: "relative" }}>
          <img
            ref={imgTag}
            src={imgSrc}
            alt="img"
            style={{
              display: "none",
            }}
          />
          <Cropper
            style={{
              containerStyle: {
                width: "100%",
                height: "290px",
              },
            }}
            image={imgSrc}
            crop={crop}
            zoom={zoom}
            aspect={2 / 1}
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          <div className="zoom-control">
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => setZoom(zoom)}
              classes={{ root: "slider" }}
            />
          </div>
          <div className="control-btn">
            <Button
              onClick={handelClose}
              variant="contained"
              size="medium"
              color="secondary"
              style={{ fontWeight: "bold" }}
              startIcon={<CancelIcon />}
            >
              cancel
            </Button>
            <Button
              onClick={handelSave}
              variant="contained"
              size="medium"
              color="primary"
              style={{ fontWeight: "bold" }}
              startIcon={<SaveIcon />}
            >
              save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Modal style
const customStyles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    minWidth: "280px",
    width: "50vw",
    maxWidth: "700px",
    minHeight: "410px",
    height: "70vh",
    maxHeigth: "470px",
    overflow: "hidden",
    padding: "0",
    backgroundColor: "#f5f5f5",
  },
  overlay: { backgroundColor: "rgba(0,0,0,0.4)", zIndex: "10" },
};

export default UploadFile;
