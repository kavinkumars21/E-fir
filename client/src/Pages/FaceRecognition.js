import React, { useEffect, useRef, useState } from "react";
import axios from 'axios'
import { Card, Form, Layout, message, Row, Select, Typography } from "antd";
import Webcam from "react-webcam";
import { CheckError } from "../Util/ErrorHandling";
import {
  getFullFaceDescription,
  isFaceDetectionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
  createMatcher
} from "../faceUtil";
import { drawRectAndLabelFace } from "../Util/drawRectAndLabelFace";
import ModelLoading from "../Util/ModelLoading";
import ModelLoadStatus from "../Util/ModelLoadStatus";
import Web3 from 'web3';
import { ethers } from 'ethers';
import abi from "../Util/FirStorage.json";
import './style.css'

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

function FaceRecognition() {

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
  const [result, setResult] = useState(false);
  const [firData, setFirData] = useState();

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

  const contractAddress = '';
  const contractAbi = abi;

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);
        console.log('Connected accounts:', accounts);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }
    loadWeb3();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        const result = await contract.getAllFIR();
        const data = result.map((Fir, index) => {
          return {
            _id: `${index + 1}`,
            name: Fir[0],
            dateOfBirth: Fir[1],
            address: Fir[2],
            phoneNumber: Fir[3],
            dateOfIncident: Fir[4],
            timeOfIncident: Fir[5],
            placeOfIncident: Fir[6],
            description: Fir[7],
            faceDescriptor: Fir[8],
          };
        });
        console.log('Data from smart contract:', data);
        setdata(data);
        setParticipants(data);
        return data;
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    }
    fetchData()
  }, [])

  // useEffect(() => {
  //   async function fetch() {
  //     try {
  //       const response = await axios.get("http://localhost:5000/api/getuser");
  //       setdata(response.data.data);
  //       console.log(response.data.data);
  //       setParticipants(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }
  //     fetch()
  // },[])

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
      }
    }

    let interval = setInterval(() => {
      capture();
      if (fullDesc && faceMatcher && participants) {
        clearInterval(interval);
        const ctx = canvasRef.current.getContext("2d");
        drawRectAndLabelFace(fullDesc, faceMatcher, participants, ctx);

        if (!!fullDesc) {
          fullDesc.map((desc) => {
            const bestMatch = faceMatcher.findBestMatch(desc.descriptor);
            if (bestMatch._label != "unknown") {
              const index = bestMatch._label - 1;
              setFirData(participants[index]);
              setResult(true);
              console.log(firData);
            }
          });
        }

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
    <div>
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
      {result &&
        <div>
          <h1 className="heading">Fir Record found</h1>
          <div className="result">
            <div className="firlabel">
              <p>Name</p>
              <p>Date of Birth</p>
              <p>Phone Number</p>
              <p>Date of Incident</p>
              <p>Time of Incident</p>
              <p>Place of Incident</p>
              <p>Description</p>
            </div>
              <div className="firdata">
                <p>{firData.name}</p>
                <p>{firData.dateOfBirth}</p>
                <p>{firData.phoneNumber}</p>
                <p>{firData.dateOfIncident}</p>
                <p>{firData.timeOfIncident}</p>
                <p>{firData.placeOfIncident}</p>
                <p>{firData.description}</p>
              </div>
          </div>
        </div>
      }
    </div>
  );
};

export default FaceRecognition
