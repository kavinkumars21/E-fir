import { Card, Col, Form, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { CheckError } from "../../Util/ErrorHandling";
import {
  isFaceDetectionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
} from "../../faceUtil";
import ModelLoadStatus from "../../Util/ModelLoadStatus";
import ModelLoading from "../../Util/ModelLoading";
import { UploadFromDisk } from "./UploadFromDisk";

export const addFacePhoto = ({ galleryRefetch, countRefetch }) => {

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessageError, setLoadingMessageError] = useState("");

  // const [addFacePhotoCallback, { loading }] = useMutation(
  //   ADD_FACE_PHOTO_MUTATION,
  //   {
  //     onError(err) {
  //       CheckError(err);
  //     },
  //   }
  // );

  // const handleSelectUploadOption = (value) => {
  //   setSelectedUploadOption(value);
  // };

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
            <UploadFromDisk
              addFacePhotoCallback={addFacePhotoCallback}
              galleryRefetch={galleryRefetch}
              countRefetch={countRefetch}
              // loading={loading}
            />
          </div>))}
    </Card>
  );
};
