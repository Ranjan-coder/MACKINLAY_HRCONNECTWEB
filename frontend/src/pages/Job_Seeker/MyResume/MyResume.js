import React, { useState } from "react";
import { GrNotes } from "react-icons/gr";
import toast from "react-hot-toast";
import ResumeStyle from "./MyResume.module.css";
import image from "./img.png";
import CurrentResume from "./CurrentResume/CurrentResume";
import PreviousResume from "./PreviousResume/PreviousResume";
import axios from "axios";

function MyResume() {
  const [resume_type, setresume_type] = useState("myresume");
  const [btn_Popup, setbtnPopup] = useState(false);
  const email = localStorage.getItem("email");
  const [selectedFile, setSelectedFile] = useState();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("resumefile", selectedFile);

    try {
      const response = await axios.post("https://mackinlay-hrconnectweb.onrender.com/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      );
      toast.success(response.data.message);
      // After successful upload, toggle the upload popup
      setbtnPopup(false);
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  const handleCheckResumeScore = () => {
    const url = 'https://www.myperfectresume.com/resume/ats-resume-checker'
    window.open(url, '_blank')
  }

  return (
    <>
      <form className={btn_Popup ? `${ResumeStyle.UploadPopUp_box}` : `${ResumeStyle.hidden_popup}`}>
        <i className="fa-solid fa-xmark" onClick={() => setbtnPopup(!btn_Popup)} />
        <div className={ResumeStyle.inner_upload_Box}>
          <p>Upload resume to apply for jobs</p>
          <div className={ResumeStyle.Upload_btn}>
            <label htmlFor="fileInput" className={ResumeStyle.customFileInput}>
              {
                selectedFile ? (
                  <p>{selectedFile.name}</p>
                ) : (
                  <div className={ResumeStyle.input_label}>
                    <div>
                      <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    </div>
                    <p>Upload Resume</p>
                  </div>
                )
              }
              <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
          </div>
          <div>
            ............................ or .............................
          </div>
          <div className={ResumeStyle.Drive_box}>
            <button className={ResumeStyle.google_upload}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" alt="drive" />
              <p>Google Drive</p>
            </button>
            <button className={ResumeStyle.google_upload}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/2202px-Dropbox_Icon.svg.png" alt="drop" />
              <p>Drop Box</p>
            </button>
          </div>
          <button type="submit" onClick={handleUpload} className={ResumeStyle.inner_Upload_btn}> Upload </button>
        </div>
      </form>

      <div className={btn_Popup ? `${ResumeStyle.blur_resume_container}` : `${ResumeStyle.resume_container}`}>
        <div className={ResumeStyle.resume_left_container}>
          <div className={ResumeStyle.resume_type_box}>
            <div className={resume_type === "myresume" ? `${ResumeStyle.job_active}` : `${ResumeStyle.typebox}`} onClick={() => setresume_type("myresume")}>
              <GrNotes />
              <span className={ResumeStyle.Grnotes}>My Resume</span>
            </div>
            <div className={resume_type === "previous_resume" ? `${ResumeStyle.job_active}` : `${ResumeStyle.typebox}`} onClick={() => setresume_type("previous_resume")}>
              <GrNotes />
              <span className={ResumeStyle.Grnotes}>Previous Resume</span>
            </div>
          </div>
          <button className={ResumeStyle.Update_resumeBtn} onClick={() => setbtnPopup(!btn_Popup)}> Update Your Resume </button>

          <div className={ResumeStyle.Resume_Collection_container}>
            {resume_type === "myresume" ? (
              <CurrentResume email={email} />
            ) : (
              <PreviousResume />
            )}
          </div>
        </div>

        <div className={ResumeStyle.resume_right_container}>
          <div className={ResumeStyle.resume_display}>
            <div className={ResumeStyle.right_title}>
              Upload your resume ATS friendly
            </div>
            <img src={image} alt="girl" className={ResumeStyle.right_image} />
            <div className={ResumeStyle.hint_box}>
              Check your resume score to gauge its effectiveness and suitability
              for potential job opportunities
            </div>
          </div>
          <button className={ResumeStyle.resume_btn} onClick={handleCheckResumeScore}> Check your resume score </button>
        </div>
      </div>
    </>
  );
}

export default MyResume;
