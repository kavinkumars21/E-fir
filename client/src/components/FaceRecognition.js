import React, { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
// import { useMutation } from "@apollo/react-hooks";
import { Card, Form, Layout, message, Row, Select, Typography } from "antd";
import Webcam from "react-webcam";
// import { FaceThresholdDistanceContext } from "../../../context";
import { CheckError } from "../Util/ErrorHandling";
import {
  getFullFaceDescription,
  isFaceDetectionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
  createMatcher
} from "../faceUtil";
// import { CREATE_TRX_MUTATION } from "../../../graphql/mutation";
import { drawRectAndLabelFace } from "../Util/drawRectAndLabelFace";
import ModelLoading from "../Util/ModelLoading";
import ModelLoadStatus from "../Util/ModelLoadStatus";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

function FaceRecognition() {

  // const { threshold } = useContext(FaceThresholdDistanceContext);

  const webcamRef = useRef();
  const canvasRef = useRef();

  const [selectedWebcam, setSelectedWebcam] = useState();

  const [inputDevices, setInputDevices] = useState([]);
  const [camWidth, setCamWidth] = useState('640');
  const [camHeight, setCamHeight] = useState('480');
  const [faceDesc, setFaceDesc] = useState([]);
  const [data, setdata] = useState([]);
  const [faceMatcher, setFaceMatcher] = useState();
  const [participants, setParticipants] = useState([]);

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessageError, setLoadingMessageError] = useState("");
  const [fullDesc, setFullDesc] = useState(null);
  const [waitText, setWaitText] = useState("");

  const webcamResolutionType = [
    { label: '300x250', width: 300, height: 250 },
    { label: '500x350', width: 500, height: 350 },
    { label: '640x480', width: 640, height: 480 },
    { label: '960x720', width: 960, height: 720 },
    { label: '1024x768', width: 1024, height: 768 },
    { label: '1280x960', width: 1280, height: 960 }
  ];

  // const [ createTrxCallback ] = useMutation(
  //   CREATE_TRX_MUTATION,
  //   {
  //     update(_, { data }) {
  //       if (data.createTrx != "") message.success(data.createTrx);
  //     },
  //     onError(err) {
  //       CheckError(err);
  //     },
  //   }
  //   );


  useEffect(() => {
    async function fetch() {
      try {
        const response = await axios.get("http://localhost:5000/api/getuser");
        setdata(response.data.data);
        console.log(response.data);
        setParticipants(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
      fetch()
  },[])

  useEffect(() => {
    async function initializeMatcher() {
      if (data.length > 0) {
        const profileList = createMatcher(data).then((resolvedFaceMatcher) => {
          setFaceMatcher(resolvedFaceMatcher);
        });

        // setFaceMatcher(profileList);
        console.log(faceMatcher);
        console.log(profileList);
      }
    }

    initializeMatcher();
  }, [data]);

  useEffect(() => {
    async function loadingtheModel() {
      await loadModels(setLoadingMessage, setLoadingMessageError);
      setIsAllModelLoaded(true);
    }
    if (
      !!isFaceDetectionModelLoaded() &&
      !!isFacialLandmarkDetectionModelLoaded() &&
      !!isFeatureExtractionModelLoaded()
    ) {
      setIsAllModelLoaded(true);
      return;
    }
    loadingtheModel();
  }, [isAllModelLoaded]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      setInputDevices({ ...inputDevices, inputDevice });
    });
  }, []);

  useEffect(() => {
    function capture() {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        getFullFaceDescription(webcamRef.current.getScreenshot(), 160)
          .then((data) => {
            setFullDesc(data);
            setWaitText("");
          })
          .catch((err) => {
            setWaitText(
              "Preparing face matcher and device setup, please wait..."
            );
          });

        // if (!!fullDesc) {
        //   console.log("Now got full desc");
        //   fullDesc.map((desc) => {
        //     const bestMatch = faceMatcher.findBestMatch(desc.descriptor);
        //     console.log(bestMatch);
        //     if (bestMatch._label != "unknown") {
        //       // createTrxCallback({
        //       //   variables: {
        //       //     attendanceID: props.match.params.attendanceID,
        //       //     studentID: bestMatch._label,
        //       //   },
        //       // });
        //       console.log("Saving in db now");
        //     }
        //   });
        // }
      }
    }

    let interval = setInterval(() => {
      capture();
      if (fullDesc && faceMatcher && participants) {
        clearInterval(interval); // Stop capturing once everything is ready
        const ctx = canvasRef.current.getContext("2d");
        drawRectAndLabelFace(fullDesc, faceMatcher, participants, ctx);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [fullDesc, faceMatcher, participants]);

  const handleSelectWebcam = (value) => {
    setSelectedWebcam(value);
  };

  const handleWebcamResolution = (value) => {
    webcamResolutionType.map((type) => {
      if (value === type.label) {
        setCamWidth(type.width);
        setCamHeight(type.height);
      }
    });
  };

  return (
    <Content>
      <Card>
        <Form>
          <Form.Item label="Webcam">
            <Select
              defaultValue="Select Webcam"
              style={{ width: 500 }}
              onChange={handleSelectWebcam}
            >
              {inputDevices?.inputDevice?.map((device) => (
                <Option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Webcam Size">
            <Select
              defaultValue='640x480'
              style={{ width: 200 }}
              onChange={handleWebcamResolution}
            >
              {webcamResolutionType.map((type) => (
                <Option key={type.label} value={type.label}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        {/* <Card>
          <Row>Face Descriptor Matcher: {facePhotos.length}</Row>
          <Row>Threshold Distance: {threshold}</Row>
        </Card> */}

        {/* {facePhotos.length === 0 && (
          <p className="alert">No have any face matcher.</p>
          )} */}
        <ModelLoadStatus errorMessage={loadingMessageError} />

        {!isAllModelLoaded ? (
          <ModelLoading loadingMessage={loadingMessage} />
        ) : loadingMessageError ? (
          <div className="error">{loadingMessageError}</div>
        ) : (
          <div></div>
        )}

        {isAllModelLoaded && loadingMessageError.length == 0 && (
          <Card className="takeAttendance__card__webcam">
            <>
              <p>{waitText}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Webcam
                  muted={true}
                  ref={webcamRef}
                  audio={false}
                  width={camWidth}
                  height={camHeight}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    deviceId: selectedWebcam,
                  }}
                  mirrored
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: "absolute",
                    textAlign: "center",
                    zindex: 8,
                    width: camWidth,
                    height: camHeight,
                  }}
                />
              </div>
            </>
          </Card>
        )}
      </Card>
    </Content>
  );
};

export default FaceRecognition
