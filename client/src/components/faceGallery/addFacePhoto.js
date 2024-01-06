import { Card, Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  isFaceDetectionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
} from "../../faceUtil";
import ModelLoadStatus from "../../Util/ModelLoadStatus";
import ModelLoading from "../../Util/ModelLoading";
import { UploadFromDisk } from "./UploadFromDisk";
import { UploadFromWebcam } from "./UploadFromWebcam";

export const AddFacePhoto = ({ galleryRefetch, countRefetch }) => {

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessageError, setLoadingMessageError] = useState("");

  const [selectedUploadOption, setSelectedUploadOption] = useState("From Disk");

  const { Option } = Select;

  const UPLOAD_OPTION = ['From Disk', 'From Webcam'];

  const handleSelectUploadOption = (value) => {
    setSelectedUploadOption(value);
  };

  useEffect(() => {
    async function loadingtheModel() {
      await loadModels(setLoadingMessage, setLoadingMessageError);
      setIsAllModelLoaded(true);
    }
    if (
      !!isFaceDetectionModelLoaded() &&
      !!isFacialLandmarkDetectionModelLoaded() &&
      !!isFeatureExtractionModelLoaded()) {
      setIsAllModelLoaded(true);
      return;
    }

    loadingtheModel();
  }, [isAllModelLoaded]);

  return (
    <Card>
      <Card title="Model Load">
        <ModelLoadStatus errorMessage={loadingMessageError} />
      </Card>
      <br />
      {!isAllModelLoaded ? (
        <ModelLoading loadingMessage={loadingMessage} />
      ) : loadingMessageError ? (
        <div className="error">{loadingMessageError}</div>
      ) : (
        isAllModelLoaded &&
        loadingMessageError.length === 0 && (
          <div>
            <Form>
                <Form.Item label="Upload Option">
                  <Select
                    defaultValue="From Disk"
                    style={{ width: 200 }}
                    onChange={handleSelectUploadOption}
                  >
                    {UPLOAD_OPTION.map((op) => (
                      <Option key={op} value={op}>
                        {op}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            {selectedUploadOption === "From Disk" ? (
            <UploadFromDisk
              // addFacePhotoCallback={addFacePhotoCallback}
              galleryRefetch={galleryRefetch}
              countRefetch={countRefetch}
              // loading={loading}
            />
            ) : (
              <UploadFromWebcam
                // addFacePhotoCallback={addFacePhotoCallback}
                galleryRefetch={galleryRefetch}
                countRefetch={countRefetch}
                // loading={loading}
              />
            )}
          </div>))}
    </Card>
  );
};
