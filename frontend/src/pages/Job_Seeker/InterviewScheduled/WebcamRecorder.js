import React, { useRef, useState, useEffect } from "react";
import "./webcam.css";
const WebcamRecorder = () => {
  const videoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [hrQuestion, setHrQuestion] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          " http://localhost:8585/interview/HrInterviewRound"
        );
        if (!response.ok) {
          throw new Error(`Http error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("this is result", result);
        setHrQuestion(result);
        console.log("hrQuestion", hrQuestion);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
    console.log("hrQuestion_outer", hrQuestion);

    const interValId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % hrQuestion.length);
      console.log(hrQuestion[currentIndex].hrquestion, currentIndex);
    }, 3000);

    return () => clearInterval(interValId);
  }, [hrQuestion.length]);

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
    startRecording();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const handleStopClick = () => {
    stopRecording();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setVideoChunks([]);
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
        // "http://localhost:9000/upload/uploadVideo",
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

  return (
    <div className="webcam_main_container">
      <div className="webcam_block">
        <video ref={videoRef} width="640" height="480" autoPlay muted />
        <div align="center">
          {recording ? (
            <button onClick={handleStopClick}>Stop Recording</button>
          ) : (
            <button onClick={handleStartClick}>Start Recording</button>
          )}
        </div>
      </div>
      <div className="hrquestion_block">
        <h1>InterView Question Round</h1>
        <p>{hrQuestion[currentIndex].hrquestion}</p>
      </div>
    </div>
  );
};

export default WebcamRecorder;
