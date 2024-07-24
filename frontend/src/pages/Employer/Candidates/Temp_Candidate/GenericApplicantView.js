import React, { useEffect, useState } from "react";
import axios from "axios";
import hrdashboard from "../../Dashboard/HrDashboard.module.css";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { GiTireIronCross } from "react-icons/gi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { handleBookmark, handleRemoveBookmark } from "../../../../Redux/ReduxSlice";
import ViewPdf from "../../Dashboard/ViewPdf";

const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
const newUrl = process.env.REACT_APP_BACKEND_BASE_URL_WITHOUT_API;

function GenericApplicantView({ Users, bookmarkUser, selectedUser, CbToogleDetails }) {
  const socket = io(`${newUrl}`);
  const [bookmarkUsers, setBookmarkUsers] = useState(bookmarkUser);
  const dispatch = useDispatch();
  const [selectedUserid, setSelectedUserid] = useState(selectedUser);
  const [userDetails, setUserDetails] = useState([]);
  const [ShowPDF, SetshowPDF] = useState(false);
  const [SelectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    setUserDetails(Users?.filter((data) => data.email === selectedUserid));
  }, [selectedUserid, Users]);

  const handleToggleCardActive = (e, id, email, jobTitle, userJobID) => {
    setSelectedUserid(id);

    axios.patch(`${baseUrl}/user/My-jobs/applicationStatus/${email}`, {
      applicationStatus: {
        JobStatus: 'In-Progress',
        StatusText: 'Application Viewed',
        updatedAt: Date.now()
      },
      userJobID
    }).then((response) => {
      if (response.data.status) {
        socket.emit("HrSendNotification", JSON.stringify({
          userEmail: email,
          NotificatioNText: `Your application for ${jobTitle} has been viewed by hr`,
          notificationStatus: 'Unread',
          updatedAt: Date.now()
        }));
      }
    });

    const clickedCard = e.currentTarget;
    clickedCard.classList.add(`${hrdashboard.__active_appliedUsers}`);
    document.querySelectorAll(".appliedUserCard").forEach((card) => {
      if (card !== clickedCard) {
        card.classList.remove(`${hrdashboard.__active_appliedUsers}`);
      }
    });
  };

  const handleSeeResumeClick = (e, user) => {
    e.preventDefault();

    axios.patch(`${baseUrl}/user/My-jobs/applicationStatus/${user?.email}`, {
      applicationStatus: {
        JobStatus: "In-Progress",
        StatusText: "Resume Viewed",
        updatedAt: Date.now()
      },
      userJobID: user?.jobID
    }).then((response) => {
      if (response.data.status) {
        socket.emit("HrSendNotification", JSON.stringify({
          userEmail: user?.email,
          NotificatioNText: `Your Resume for ${user?.jobTitle} has been viewed by hr`,
          notificationStatus: 'Unread',
          updatedAt: Date.now()
        }));
      }
    });

    SetshowPDF(true);
    setSelectedResume({
      userProfile: user?.profileImage,
      userResume: user?.resume[0],
      userEmail: user?.email
    });
  };

  const handleUserBookmark = (e, user) => {
    e.preventDefault();
    dispatch(handleBookmark({ email: user.email, jobTitle: user.jobTitle }));
    axios.post(`${baseUrl}/user/bookmarkd/create-bookamark/${localStorage.getItem('email')}`, user)
      .then((response) => {
        if (response.data.success) {
          setBookmarkUsers([...bookmarkUsers, user]);
          toast.success(response.data.msg);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        toast.error(`${error.message}`);
      });
  };

  const handleRemoveUserBookmark = (e, user) => {
    dispatch(handleRemoveBookmark({ email: user.email, jobTitle: user.jobTitle }));
    const email = localStorage.getItem('email');
    const url = `${baseUrl}/user/bookmarkd/delete-bookmark/${email}-${user.email}-${user.Job_title}`;
    axios.delete(url)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          setBookmarkUsers(bookmarkUsers.filter(bmUser => bmUser.email !== user.email || bmUser.Job_title !== user.Job_title));
          toast.success(response.data.msg);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };

  return (
    <>
      <h1 className={hrdashboard.__applicationDetails_Header}>
        Applicant's Details{" "}
        <GiTireIronCross
          className={hrdashboard.__applicationDetails_CloseButton}
          onClick={() => CbToogleDetails(false)}
        />
      </h1>
      <div className={hrdashboard.__applicationDetailsContainer}>
        <div className={hrdashboard.__applicantDetails__ListBox}>
          {Users?.map((user) => (
            <div
              className={`appliedUserCard ${hrdashboard.__appliedUsers} ${hrdashboard.__Secondary_appliedUsers} ${user.email === selectedUser && hrdashboard.__active_appliedUsers}`}
              key={user._id}
              onClick={(e) => handleToggleCardActive(e, user._id, user.email, user?.jobTitle, user?.jobID)}
            >
              <div className={hrdashboard.__appliedHeader}>
                <img
                  className={hrdashboard.__userPF}
                  src={user.profileImage ?? "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"}
                  alt=""
                  onError={(e) => {
                    e.target.src = `https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg`;
                    e.onError = null;
                  }}
                />
                <section>
                  <span style={{ fontSize: "20px" }}>
                    <strong>{user.name}</strong>
                  </span>
                  <p style={{ fontSize: "15px" }}>{user?.biography?.slice(0,30)}</p>
                </section>
                {bookmarkUsers.some((data) => data.email === user.email && data.Job_title === user.Job_title) ? (
                  <FaBookmark style={{ fontSize: "20px" }} onClick={(e) => handleRemoveUserBookmark(e, user)} />
                ) : (
                  <FaRegBookmark style={{ fontSize: "20px" }} onClick={(e) => handleUserBookmark(e, user)} />
                )}
              </div>
              <div className={hrdashboard.__appliedBody}>
                <span>
                  Location - <strong>{user.location}</strong>
                </span>
                <span>
                  Type - <strong>{user.employmentType}</strong>
                </span>
              </div>
              <div>
                <h6>Skills</h6>
                <div className={hrdashboard.__appliedSkills}>
                  {user.skills?.slice(0, 3).map((skill) => (
                    <span key={skill._id}>{skill.name}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={hrdashboard.__applicantDetails_Container}>
          {userDetails.map((user) => (
            <div className={hrdashboard.__applicantDetails} key={user._id}>
              <div className={hrdashboard.__appliedHeader}>
                <img
                  className={hrdashboard.__userPF}
                  src={user.profileImage ?? "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"}
                  alt=""
                  onError={(e) => {
                    e.target.src = `https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg`;
                    e.onError = null;
                  }}
                />
                <span style={{ fontSize: "20px" }}>
                  <strong>{user.name}</strong>
                </span>
                {bookmarkUsers.some((data) => data.email === user.email && data.Job_title === user.Job_title) ? (
                  <FaBookmark className={hrdashboard.__bookmark} onClick={(e) => handleRemoveUserBookmark(e, user)} />
                ) : (
                  <FaRegBookmark className={hrdashboard.__bookmark} onClick={(e) => handleUserBookmark(e, user)} />
                )}
              </div>
              <p style={{ textAlign: "justify" }}>{user.biography}</p>
              <div className={hrdashboard.__applicantPlace}>
                <span>
                  State - <strong>{user.state}</strong>
                </span>
                <span>
                  Country - <strong>{user.country}</strong>
                </span>
              </div>
              <div>
                <h6>Skills</h6>
                <div className={hrdashboard.__appliedSkills}>
                  {user.skills?.map((skill) => (
                    <span key={skill._id}>{skill.name}</span>
                  ))}
                </div>
              </div>
              <>
                <h6>Appilcant Note :</h6>
                {user.note ?? "N/A"}
              </>
              <div className={hrdashboard.__applicantButtons}>
                <button className={hrdashboard.__applicantBtn} onClick={(e) => handleSeeResumeClick(e, user)}>
                  See Resume
                </button>
                <button className={hrdashboard.__applicantBtn} style={{ background: "blue", padding: "0 4em" }}>
                  Schedule Interview
                </button>
              </div>
            </div>
          ))}
        </div>

        {ShowPDF && <ViewPdf CbTogglePDF={SetshowPDF} SelectedResume={SelectedResume} />}
      </div>
    </>
  );
}

export default GenericApplicantView;
