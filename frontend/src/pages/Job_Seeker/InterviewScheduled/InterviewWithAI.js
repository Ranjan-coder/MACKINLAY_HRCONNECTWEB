import React, { useEffect, useState } from "react";
import interview from "./Interview.module.css";
import { useNavigate, useParams } from "react-router-dom";
import no_interview from '../../../Assets/no_interview.png';
import axios from "axios";

export default function InterviewWithAI() {
  const [interviewedUsers, setInterviewedUsers] = useState([]);
  const { HrEmail } = useParams();

  useEffect(() => {
    fetchInterviewedUsers();
  }, [HrEmail]);

  const fetchInterviewedUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:8585/api/interview/getCandidate/${HrEmail}`);
      console.log(response.data);
      if (response.data.success) {
        setInterviewedUsers(response.data.data);
      } else {
        console.error("Failed to fetch interviewed users");
      }
    } catch (error) {
      console.error("Error fetching interviewed users:", error);
    }
  };

  const candidateEmail = localStorage.getItem('email');
  const filteredUsers = interviewedUsers.filter(user => user.userEmail === candidateEmail && user.interviewType === "Ai");
  const [showPopUp, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setShowPopup(true);
  };

  const Webcam = () => {
    navigate("/webcaminterview");
  };

  const isJoinButtonEnabled = (interviewDate, interviewTime) => {
    const interviewDateTime = new Date(`${interviewDate}T${interviewTime}`);
    const currentTime = new Date();
    return currentTime < interviewDateTime;
  };

  return (
    <div className={interview.__interviewWithAI_Page}>
      <h2 style={{ color: "grey" }}>My Schedule</h2>
      {filteredUsers.length > 0 ? (
        <div className={interview.__interview_Lists}>
          {filteredUsers.map((user, index) => (
            <div key={index} className={interview.__interview_Details}>
              <div
                className={interview.__Interview_Timings}
                style={{ backgroundColor: "yellow" }}
              >
                <div className={interview.__interview_Dates}>
                  {user.interviewType} Interview
                  <p>{user.interviewDate}</p>
                  <p style={{ fontSize: "13px" }}>{new Date(user.interviewDate).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                </div>
                <p className={interview.__interview_Times}>{user.interviewTime}</p>
              </div>
              <button
                className={interview.__btn_meet_Calls}
                onClick={handleClick}
                disabled={!isJoinButtonEnabled(user.interviewDate, user.interviewTime)}
              >
                Join Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={interview.__interview_Page}>
          <h2 style={{ color: "grey" }}>No Interviews scheduled yet</h2>
          <img className={interview.no_interview} src={no_interview} alt="No Interviews" />
        </div>
      )}

      {showPopUp && (
        <div className={interview.__popup_instruction}>
          <h4 className={interview.Instruction_Heading}>Instruction</h4>
          <ul>
            <li>Locate your camera App;</li>
            <li>Depending on your device computer, smartphone, tablet, find the camera application. It might be labeled as "Camera" or above </li>
          </ul>
          <div className={interview.__buttons}>
            <button
              className={interview.__btn_Cancel}
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
            <button className={interview.__btn_meet_Calls} onClick={Webcam}>
              Join Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
