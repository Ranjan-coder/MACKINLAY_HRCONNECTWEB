import React, { useEffect, useState } from "react";
import JobStyle from "../MyJobs/Job.module.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import toast from "react-hot-toast";
import Loader from "../../Common-Components/Loaders/Loader"
import { CalculateTimeAgo } from "../../Common-Components/TimeAgo";
import { useSelector, useDispatch } from "react-redux"
import { handleRemoveSavedJob } from "../../../Redux/ReduxSlice";
import fill_fav from "../../../Assets/Filled_favoutite.png"
const Saved = () => {
  const { email } = useSelector((state) => state.Assessment.currentUser);
  const [IsLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [saved_jobs, setSaved_jobs] = useState([]);
  const navi = useNavigate();


  const handleRemoveSaveClick = (e, jobId) => {
    e.preventDefault();
    setIsLoading(true);
    axios.delete(`http://localhost:8080/api/user/My-jobs/delete/save-job/${email + '-' + jobId}`).then((response) => {
      if (response.data.success) {
        toast.success(`${response.data.msg}`);
        dispatch(handleRemoveSavedJob(jobId));
        loadSavedJobs()
      } else {
        toast.error(`${response.data.msg}`);
        loadSavedJobs();
      }
    }).catch((error) => {
      toast.error(`server failed! Try again ${error.message}`);
    })
  }

  const loadSavedJobs = () => {
    setIsLoading(true)
    axios.get(`http://localhost:8080/api/user/My-jobs/get/save-job/${email}`).then((response) => {
      if (response.data.success) {
        setSaved_jobs(response.data.savedJob);
        setIsLoading(false)
      } else {
        setSaved_jobs([]);
        setIsLoading(false)
      }
    }).catch((error) => {
      setIsLoading(false)
      toast.error(`Server failed to load, Realod your page : ${error.message}`)
    })
  }

  useEffect(loadSavedJobs, [email])

  return (
    <>
      {IsLoading ? <Loader /> : <>
        {
          saved_jobs.map((item, index) => {
            return (
              <div className={JobStyle.company_box} key={index}>
                <div className={JobStyle.saved_job_box}>
                  <div className={JobStyle.company_job_profile}>
                    <img src={item.jobPoster} alt="comp_logo" />
                    <div className={JobStyle.job_position}>
                      <h5>{item.jobTitle}</h5>
                      <CalculateTimeAgo time={item.createdAt} />
                    </div>
                  </div>
                  <div className={JobStyle.lpa_box}>
                    <i
                      className="fa-solid fa-money-check-dollar"
                      style={{ color: "#067418" }}
                    ></i>
                    <span style={{ fontWeight: "bold" }}>{item.salaryRange}</span>
                  </div>
                  <div className={JobStyle.apply_box}>
                    <img src={fill_fav} alt="SavedJob" className={JobStyle.removeSavedJobButton} onClick={(e) => handleRemoveSaveClick(e, item.jobID)} />

                    <button className={JobStyle.btn_apply} >APPLY</button>
                  </div>
                </div>
                <div className={JobStyle.location_box}>
                  <div className={JobStyle.req_1}>
                    <i
                      className="fa-solid fa-location-dot"
                      style={{ color: "black" }}
                    ></i>

                    {item.location}
                  </div>
                  <div className={JobStyle.req_1}>
                    <div>
                      <i
                        className="fa-solid fa-envelope-open-text"
                        style={{ color: "black" }}
                      ></i>
                    </div>
                    {item.jobExperience}
                  </div>
                  <div className={JobStyle.req_1}>
                    <div>
                      <i
                        className="fa-solid fa-droplet"
                        style={{ color: "black" }}
                      ></i>
                    </div>
                    {item.employmentType}
                  </div>
                </div>
              </div>
            );
          })
        }

      </>
      }
      {saved_jobs.length === 0 && !IsLoading && (
        <>
          <p>You have not Save any jobs. Find and grab the opportunity now !</p>
          <button onClick={() => navi("/")}>Find Jobs !</button>
        </>
      )}
    </>
  );
};

export default Saved;
