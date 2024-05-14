import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Upload } from "antd";
import React, { useState } from "react";
import { getFullFaceDescription } from "../../faceUtil";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
const inputSize = 160;
export const UploadFromDisk = ({
  // addFacePhotoCallback,
  // galleryRefetch,
  // countRefetch,
  variablesdata,
  loading,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fullDesc, setFullDesc] = useState([]);
  const [faceDescriptor, setFaceDescriptor] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isRunningFaceDetector, setIsRunningFaceDetector] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);

  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ fileList }) => {
    if (fileList.length === 0) {
      setFaceDescriptor([]);
      setDetectionCount(0);
      setFileList([]);
      return;
    }

    if (!fileList[0].url && !fileList[0].preview) {
      if (/\.(jpe?g|png)$/i.test(fileList[0].name) === false) {
        alert("Not an image file (only JPG/JEPG/PNG accepted)!");
        return;
      }
      fileList[0].preview = await getBase64(fileList[0].originFileObj);
    }
    setPreviewImage(fileList[0].url || fileList[0].preview);
    setFileList(fileList);

    if (fileList[0].preview.length > 0) {
      setIsRunningFaceDetector(true);
      await getFullFaceDescription(fileList[0].preview, inputSize).then(
        (data) => {
          setFullDesc(data);
          setDetectionCount(data.length);
          setFaceDescriptor(data[0]?.descriptor);
          setIsRunningFaceDetector(false);
        }
      );
    }
  };
  const variables = {
    photoData: previewImage,
    faceDescriptor: faceDescriptor.toString()
  }


  const handleSubmit = () => {
    if (previewImage.length > 0 && faceDescriptor.length === 128)
      variablesdata(variables);
  };
  return (
    <>
      <Row style={{ display: "flex", alignItems: "center" }}>
        <Col>
          <Upload
            beforeUpload={() => false}
            multiple={false}
            listType="picture-card"
            onPreview={handlePreview}
            onChange={handleChange}
            accept="image/x-png,image/jpeg"
            progress
            fileList={fileList}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Col>
        <Col>
          {" "}
          <Button
            type="primary"
            loading={loading}
            disabled={
              previewImage.length === 0 ||
              loading ||
              detectionCount !== 1 ||
              faceDescriptor.length !== 128
            }
            onClick={handleSubmit}
          >
            Add Photo
          </Button>
        </Col>
      </Row>
      <Row>
        <div>
          {detectionCount > 1 && (
            <span className="alert">Only single face allowed</span>
          )}
          {detectionCount === 0 && (
            <span className="alert">No face detected</span>
          )}
          <p>
            Number of detection:{" "}
            {isRunningFaceDetector ? (
              <>
                Detecting face... <LoadingOutlined />
              </>
            ) : (
              detectionCount
            )}
          </p>
          Face Descriptor:{" "}
          {detectionCount === 0 && !isRunningFaceDetector && <span>Empty</span>}
          {isRunningFaceDetector && (
            <>
              Generating 128 measurements... <LoadingOutlined />
            </>
          )}
          <br />
          {fullDesc.map((desc, index) => (
            <div
              key={index}
            >
              <p>
                {/* Face #{index + 1}:{" "} */}
                Generated descriptor for 1 face
              </p>
              {/* {" "} */}
              {/* {desc.descriptor.toString()} */}
            </div>
          ))}
        </div>
      </Row>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};
