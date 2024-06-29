import React, { useRef, useState, useEffect } from "react";
import "./webcam.css";
import axios from "axios";
import { IoMicOutline } from "react-icons/io5";
import { IoMicOffOutline, IoVideocam, IoVideocamOff } from "react-icons/io5";
// import JobSeekerStyle from "../JobSeeker.module.css";
const WebcamRecorder = () => {
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [hrQuestions, setHrQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8585/interview/HrInterviewRound"
        );
        setHrQuestions(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching HR questions:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (hrQuestions.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % hrQuestions.length);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [hrQuestions]);

  const startRecording = () => {
    if (mediaStream) {
      const recorder = new MediaRecorder(mediaStream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setVideoChunks((prevChunks) => [...prevChunks, e.data]);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleStartClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      startRecording();
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const handleStopClick = () => {
    stopRecording();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    uploadVideo();
  };

  const uploadVideo = async () => {
    const blob = new Blob(videoChunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append("file", blob, "recorded-video.webm");

    try {
      const response = await fetch(
        "http://localhost:8585/interview/uploadInterview",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        console.log("Video uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };
  const recognition = new window.webkitSpeechRecognition();
  const toggleMicListening = (e) => {
    e.preventDefault();
    if (isListening) {
      recognition.stop(); // Stop speech recognition if it's currently listening
      setIsListening(false);
    } else {
      recognition.start(); // Start speech recognition
      setIsListening(true);
    }
  };
  const toggleWebcam = () => {
    if (isWebcamOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null; // Clear the srcObject
      }
    } else {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }).catch(err => console.error('Error accessing webcam: ', err));
    }
    setIsWebcamOn(!isWebcamOn);
  };
  return (
    <div className={"webcam_main_container"}>
      <div className={"webcam_block"}>
        <video ref={videoRef} width="450" height="325" autoPlay muted />
        <div className="wecampart">
          <div className="webcammic">
            {isListening ? (
              <IoMicOutline
                className={"Search_MICICON"}
                onClick={toggleMicListening}
              />
            ) : (
              <IoMicOffOutline
                className={"Search_MICICON"}
                onClick={toggleMicListening}
              />
            )}
          </div>
          <div className="webcamvideo">
            {isWebcamOn ? (
              <IoVideocam
                className={"Search_VEOICON"}
                onClick={toggleWebcam}
              />
            ) : (
              <IoVideocamOff
                className={"Search_VEOICON"}
                onClick={toggleWebcam}
              />
            )}
          </div>
        </div>
        <div align="center">
          {recording ? (
            <button onClick={handleStopClick}>Stop Recording</button>
          ) : (
            <button onClick={handleStartClick}>Start Recording</button>
          )}
        </div>
      </div>
      <div className="hrquestion_block">
        <h1>Interview Question Round</h1>
        <p>
          {hrQuestions.length > 0
            ? hrQuestions[currentIndex].hrquestion
            : 'Loading questions...'}
        </p>
      </div>
    </div>);
};

export default WebcamRecorder;
