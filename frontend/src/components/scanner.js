import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from 'reactstrap';
import AlarmToast from './AlarmToast';
import CamerasButton from './CamerasButton';

function Scanner({ blockName, scan, setScan, needSubmit }) {
  const [scanedData, setScanedData] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [cameraId, setCameraId] = useState(null);
  const html5QrCode = useRef(null);
  const submitButton = useRef(null);
  const [isToast, setIsToast] = useState(false);
  const scanCheckTimes = 3;

  const email = sessionStorage.getItem("email");


  var checkVars = {
    lastResult: 0,
    lastCheckScan: 0,
    counterCheckScan: 0
  };

  var ifTorch = false;
  var ifZoom = false;        

  const qrCodeSuccessCallback = (decodedText) => {
    setScanedData(prevScanedData => {
      var decodedList = decodedText.split("/");
      decodedText = decodedList[decodedList.length - 1];
      if (!prevScanedData.includes(decodedText)) {
        if (!checkVars.lastCheckScan) {
          checkVars.lastCheckScan = decodedText;
          checkVars.counterCheckScan++;
        } else {
          if (checkVars.lastCheckScan === decodedText) {
            checkVars.counterCheckScan++;
          } else {
            checkVars.lastCheckScan = 0;
            checkVars.counterCheckScan = 0;
          }
          if (checkVars.counterCheckScan === scanCheckTimes) {
            checkVars.counterCheckScan = 0;
            checkVars.lastResult = checkVars.lastCheckScan;

            return [...prevScanedData, checkVars.lastResult];
          }
        }
      }
      // Return the previous state if no updates are made
      return prevScanedData;
    });
  };  
  
  
  const dataReset = () => {
    checkVars.lastResult = 0;
    checkVars.lastCheckScan = 0;
    checkVars.counterCheckScan = 0;
    setScanedData(prevData => []);
  };

  const dataSubmit = () => {
    if (scanedData.length === 4) {
      axios.post("/cycles", {"entries": scanedData, "userEmail": email});
      dataReset();
      setScan(false);
    } else {
      setIsToast(true);
    }

  };

  // Function to choose the desired camera based on label containing "0"
  const chooseDesiredCameraId = (videoDevices) => {
    if (cameraId) {
      if (videoDevices.some(device => device.deviceId === cameraId)) {
        return cameraId;
      }
    } else if (sessionStorage.getItem("cameraId") !== "undefined") {
      if (videoDevices.some(device => device.deviceId === sessionStorage.getItem("cameraId"))) {
        return sessionStorage.getItem("cameraId");
      }
    }
    const desiredCamera = videoDevices?.find(device => device.label.includes("0"));
    return desiredCamera?.deviceId || null;
  };
  

  const changeCamera = (deviceId) => {
    if (email) {
      axios.post("auth/setcameraid", {"email": email, "cameraId": deviceId})
        .then(res => {
          if (res.status === 204) {
            console.warn("User not found");
          } else {
            sessionStorage.setItem("cameraId", deviceId);
            setCameraId(deviceId);
          }
        })
        .catch(err => console.warn(err));
    } else {
      setCameraId(deviceId);
    }
  };
  

  const scannerCleanUp = () => {
    dataReset();
    html5QrCode.current.stop();
    html5QrCode.current = null;
    checkVars.lastResult = 0;
    checkVars.lastCheckScan = 0;
    checkVars.counterCheckScan = 0;
  }

  const getVideoDevices = () => {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      setVideoDevices(() => devices.filter(device => device.kind === 'videoinput'))
    }).catch(err => console.warn(err));
  }

  useEffect(() => {
    getVideoDevices();
    setTimeout( () => {
      if (scan) {
        html5QrCode.current = new Html5Qrcode(blockName);

        let constraints = {facingMode: "environment"};
        const config = { 
          fps: 100, 
          aspectRatio: 1.0 };

        // Choose the desired camera based on label containing "0" or fallback to default back camera
        const desiredCameraId = chooseDesiredCameraId(videoDevices);
        
        // Construct constraints with desired camera deviceId
        if (desiredCameraId) {
          constraints = {deviceId: { exact: desiredCameraId }};
        }
        html5QrCode.current.start(constraints, config, qrCodeSuccessCallback).catch(err => {
          alert("No camera device found or camera permission wasn't set")
          console.log(err);
          console.log(constraints);
        });

        setTimeout(() => {
          if (html5QrCode.current && html5QrCode.current.getState() === 2) {
            const trackCapabilities = html5QrCode.current.getRunningTrackCameraCapabilities().track.getCapabilities();
            const trackSettings = html5QrCode.current.getRunningTrackSettings();
            getVideoDevices();
            
            if (ifZoom && trackCapabilities.zoom) {
              html5QrCode.current.applyVideoConstraints({ zoom: true });
            
      
              const zoomConstraints = { advanced: [{ zoom: 3 }] };
              html5QrCode.current.getRunningTrackCameraCapabilities().track.applyConstraints(zoomConstraints)
                .catch((error) => {
                  console.error("Error applying zoom constraints:", error);
                });
            } else {
              console.warn("Zoom is not supported by the camera");
            }
          
            // Check if torch is supported
            if (ifTorch && "torch" in trackSettings ) {
              let torchConstraints = {
                "torch": true,
                "advanced": [{ "torch": true }]
              }
              html5QrCode.current.applyVideoConstraints(torchConstraints);

            } else {
              console.warn("Torch is not supported by the camera");
            }
          }
        }, 300);
      }
    }, 200);


    return () => {
      if (html5QrCode.current) {
        scannerCleanUp();
      }
    }
  }, [scan, cameraId]);  

  if (scan) {
    return (
      <Container className="my-2">
        <Row>
          <Col xs='12' md={{ offset: 3, size: 6 }}>
            <div id={ blockName } width="300px"></div>
          </Col>
        </Row>
        {(scanedData.length!==0)? <Row className='mt-1'>
          <Col xs='12' md={{ offset: 3, size: 6 }}>
            <ListGroup>
                {scanedData.map((entry, index) => (
                  <ListGroupItem><h5>{index + 1}. {entry}</h5></ListGroupItem>
                ))}
            </ListGroup>
          </Col>
        </Row>:null}
        {needSubmit &&
          <Row>
            <Col xs='12' md={{ offset: 3, size: 6 }}
            className='my-1'>
              <Button ref={submitButton} onClick={dataSubmit}
              color={scanedData.length === 4 ? 'success' : 'secondary'}
              className='col-6 mx-auto'>
                Submit
              </Button>
            </Col>
          </Row>
        }
        <Row className="justify-content-center my-2">
          <Col xs='auto'>
            <Button onClick={dataReset}
            color='light'>
              Reset
            </Button>
          </Col>
          {scan?<Col xs="auto">
            <CamerasButton videoDevices={videoDevices} changeCamera={changeCamera}/>
            {/* <UncontrolledDropdown direction="up">
              <DropdownToggle color="light">
                Cameras
                <DropdownMenu>
                  {videoDevices.map( (camera, index) => (
                    <DropdownItem onClick={() => changeCamera(camera.deviceId)}>Camera #{index}</DropdownItem>
                  ))}
                </DropdownMenu>
              </DropdownToggle>
            </UncontrolledDropdown> */}
          </Col>:null}
        </Row>
        {isToast && <AlarmToast message="There must be 4 kegs to submit"/>}
      </Container>
    );
  }

  return null;
}

export default Scanner;
