import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import styles from "./Interview.module.css";
import { IoStar } from "react-icons/io5";
import { BsPersonVideo } from "react-icons/bs";
import { GrTextAlignFull } from "react-icons/gr";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import { BsFileImage } from "react-icons/bs";

const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

function Interview() {
  const navigation = useNavigate();
  const { HrEmail } = useParams();
  const location = useLocation();
  const { userEmail, userName, UserProfile, UserId } = location.state;
  console.log(location.state);
  const [file, setFile] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    interviewType: "",
    interviewDate: "",
    interviewTime: "",
    interviewerName: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterviewDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userEmail", userEmail);
      formData.append("userName", userName);
      formData.append("interviewDetails", JSON.stringify(interviewDetails));
      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        `${baseUrl}/interview/schedule-interview/${HrEmail}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigation("/interview_scheduled");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error scheduling interview:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to schedule interview.");
    }
  };

  const handleCancel = () => {
    setInterviewDetails({
      interviewType: "",
      interviewDate: "",
      interviewTime: "",
      interviewerName: "",
      location: "",
      description: "",
    });
   setTimeout(() => {
    navigation("/hr_dashboard")
   }, 500);
   toast.error("Interview Schedule Cancelled");
  };

  return (
    <>
    <Toaster/>
    <div className={`container ${styles.mainContainer}`}>
      <div className={`row mb-4 ${styles.upperContainer}`}>
        <div className="col-md-6 d-flex align-items-center">
          <img
            className={styles.upperContImg}
            src={
              UserProfile ??
              "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
            }
            alt="network-error"
          />
          <div className="ml-3">
            <p style={{marginLeft:"10px"}}>{userName}</p>
            <p>
              <IoStar className={styles.star} />
              4.0
            </p>
          </div>
        </div>
        <div className="col-md-6 text-right">
          <p>Candidate ID:</p>
          <p>{UserId}</p>
        </div>
      </div>
      <hr />
      <div className={styles.formMain}>
        <div className="row">
          <div className={`col-md-6 ${styles.formSub}`}>
            <label htmlFor="interviewType" className={styles.label}>
              <BsPersonVideo />
              Interview type
            </label>
            <select
              id="interviewType"
              name="interviewType"
              className="form-control"
              value={interviewDetails.interviewType}
              onChange={handleChange}
            >
              <option value="" disabled>Select</option>
              <option value="walk">Walk-in-drive</option>
              <option value="virtual">Virtual</option>
              <option value="Ai">Interview With Ai</option>
            </select>
          </div>
          <div className={`col-md-6 ${styles.formSub}`}>
            <label htmlFor="description" className={styles.label}>
              <GrTextAlignFull />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={interviewDetails.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="row">
          <div className={`col-md-6 ${styles.formSub}`}>
            <label htmlFor="interviewDate" className={styles.label}>
              <FaRegCalendarAlt />
              Interview date
            </label>
            <input
              type="date"
              id="interviewDate"
              name="interviewDate"
              className="form-control"
              value={interviewDetails.interviewDate}
              onChange={handleChange}
            />
          </div>
          <div className={`col-md-6 ${styles.formSub}`}>
            <label htmlFor="interviewTime" className={styles.label}>
              <MdAccessTime />
              Interview time
            </label>
            <input
              type="time"
              id="interviewTime"
              name="interviewTime"
              className="form-control"
              value={interviewDetails.interviewTime}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className={`col-md-6 ${styles.formSub}`}>
            <label htmlFor="interviewerName" className={styles.label}>
              <FaUser />
              Interviewer name
            </label>
            <input
              type="text"
              id="interviewerName"
              name="interviewerName"
              className="form-control"
              value={interviewDetails.interviewerName}
              onChange={handleChange}
            />
          </div>
          <div className={`col-md-6 ${styles.formSub}`}>
            <label htmlFor="location" className={styles.label}>
              <IoLocationOutline />
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-control"
              value={interviewDetails.location}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div>
        <p className={styles.fileUpload}>
          <IoMdAttach />
          Attachments
        </p>
        <div className={styles.fileBox}>
          <BsFileImage />
          <span> Drop your image here or</span>
          <label htmlFor="file">
            <span>browse</span>
          </label>
          <input type="file" id="file" onChange={handleFileChange}></input>
        </div>
      </div>
      <div className={`mt-4 ${styles.buttonGroup}`}>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
        <button
          className="btn"
          style={{ backgroundColor: "#0050d1", color: "white" }}
          onClick={handleSchedule}
        >
          Schedule Interview
        </button>
      </div>
    </div>
    </>
  );
}

export default Interview;
