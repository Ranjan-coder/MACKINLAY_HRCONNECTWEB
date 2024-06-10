import React, { useState } from "react";
import Interviewcss from "./Interview.module.css";
import maleImage from '../../../Assets/Male-Image.png';
import { IoStar } from "react-icons/io5";
import { BsPersonVideo } from "react-icons/bs";
import { GrTextAlignFull } from "react-icons/gr";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import { BsFileImage } from "react-icons/bs";
import axios from 'axios';

function Interview() {
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore... et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "
  );
   const email=localStorage.getItem('email');
   const candidateEmail=localStorage.getItem('candidateEmail')
  const [interviewDetails, setInterviewDetails] = useState({
    candidateName:"",
    candidateEmail:email,
    interviewType: "",
    interviewDate: "",
    interviewTime: "",
    interviewerName: "",
    location: "",
    description: "",
  });

  const handleDescriptionChange = (event) => {
    const content = event.target.value;
    setDescription(content);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInterviewDetails(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const sliceDescription = () => {
    const words = description.split(" ");
    const slicedContent = words.slice(0, 15).join(" ");
    return slicedContent;
  };

  const handleScheduleInterview = () => {
    const updatedDetails = {
      ...interviewDetails,
      description: sliceDescription(),
    };

    axios.post('http://localhost:8585/api/v1/interview/interViewShedule', updatedDetails)
      .then(response => {
        console.log('Success:', response.data);
        alert('Interview scheduled and email sent successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error in scheduling interview or sending email');
      });
  };

  return (
    <div className={Interviewcss.main_containers}>
      <div className={Interviewcss.uppercontainer}>
        <div className={Interviewcss.uppercontainer_left}>
          <img
            className={Interviewcss.upper_cont_img}
            src={maleImage}
            alt="network-error"
          />
          <div className={Interviewcss.uppercontainer_left1}>
            <p>{candidateEmail}</p>
            <p>
              <IoStar className={Interviewcss.star} />
              4.0
            </p>
          </div>
        </div>
        <div className={Interviewcss.uppercontainer_right}>
          <p>Candidate ID:</p>
          <p>12345678</p>
        </div>
      </div>
      <hr className={Interviewcss.horizontal_line}></hr>

      <div className={Interviewcss.formMain_cont}>
        <div className={Interviewcss.formMain_cont1}>
          <div className={Interviewcss.formSub_con1}>
            <label htmlFor="interviewType" className={Interviewcss.box}>
              <BsPersonVideo />
              Interview type{" "}
            </label>
            <br></br>
            <select
              id="interviewType"
              className={Interviewcss.boxes}
              value={interviewDetails.interviewType}
              onChange={handleInputChange}
              required
            >
              <option value=""></option>
              <option value="walk">Walk-in-drive</option>
              <option value="virtual">Virtual</option>
              <option value="face">Face to face</option>
            </select>
          </div>
          <div
            className={`${Interviewcss.formSub_con} ${Interviewcss.formSub_contain}`}
          >
            <label htmlFor="description" className={Interviewcss.box}>
              <GrTextAlignFull />
              Description
            </label>
            <textarea
              id="description"
              className={`${Interviewcss.description_input} ${Interviewcss.des}`}
              value={sliceDescription()} 
              onChange={handleDescriptionChange} 
              required
            >
            </textarea>
          </div>
        </div>
        <div className={Interviewcss.formMain_cont2}>
          <div className={Interviewcss.formSub_con}>
            <label htmlFor="interviewDate" className={Interviewcss.box}>
              <FaRegCalendarAlt />
              Interview date
            </label>
            <input
              type="date"
              id="interviewDate"
              className={Interviewcss.description_input}
              value={interviewDetails.interviewDate}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <div className={Interviewcss.formSub_con}>
            <label htmlFor="interviewTime" className={Interviewcss.box}>
              <MdAccessTime />
              Interview time
            </label>
            <input
              type="time"
              id="interviewTime"
              className={Interviewcss.description_input}
              value={interviewDetails.interviewTime}
              onChange={handleInputChange}
              required
            ></input>
          </div>
        </div>
        <div className={Interviewcss.formMain_cont3}>
          <div className={Interviewcss.formSub_con}>
            <label htmlFor="interviewerName" className={Interviewcss.box}>
              <FaUser />
              Interviewer name
            </label>
            <input
              type="text"
              id="interviewerName"
              className={Interviewcss.description_input}
              value={interviewDetails.interviewerName}
              onChange={handleInputChange}
              required
            ></input>
          </div>
          <div className={Interviewcss.formSub_con}>
            <label htmlFor="location" className={Interviewcss.box}>
              <IoLocationOutline />
              Location
            </label>
            <input
              type="text"
              id="location"
              className={Interviewcss.description_input}
              value={interviewDetails.location}
              onChange={handleInputChange}
              required
            ></input>
          </div>
        </div>
      </div>

      <div>
        <p className={Interviewcss.fileupload}>
          <IoMdAttach />
          Attachments
        </p>
        <div className={Interviewcss.filebox}>
          <BsFileImage className={Interviewcss.imgs} />
          <span> Drop your image here or</span>
          <label htmlFor="file">
            <span className={Interviewcss.f}>browse</span>
          </label>
          <input type="file" id="file"></input>
        </div>
      </div>
      <div className={Interviewcss.last_container}>
        <button className={Interviewcss.cancel_btn}>Cancel</button>
        <button
          className={Interviewcss.Interview_btn}
          onClick={handleScheduleInterview}
        >
          Schedule Interview
        </button>
      </div>
    </div>
  );
}export default Interview;
 