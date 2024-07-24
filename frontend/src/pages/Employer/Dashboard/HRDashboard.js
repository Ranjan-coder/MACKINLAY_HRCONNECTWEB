import React, { useEffect, useState } from "react";
import hrdashboard from "./HrDashboard.module.css";
import layout from "../components/RecruiterLayout.module.css";
import user from "../../../Assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faTrash , faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { IoMicOutline } from "react-icons/io5";
import { IoMicOffOutline } from "react-icons/io5";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { format } from "date-fns";
import Loader from "../../Common-Components/Loaders/Loader";
import { CalculateTimeAgo } from "../../Common-Components/TimeAgo";
import HrJobDetail from "./HrJobDetail";
import { handleSearchData } from "../../../Redux/ReduxFilterSlice";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

export default function HRDashboard() {
  const { SearchOptions } = useSelector((state) => state.Filter);
  const [searhOption, setSearchOption] = useState({ searchText: "" });
  const [isListening, setIsListening] = useState(false);
  const [jobPost, setJobPost] = useState([]);
  const [sortedJob, setSortedJob] = useState([]);
  const [selectedSort, setSelectedSort] = useState("Sort By");
  const [loading, setLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [ShowApplicantDetails, setShowApplicantDetails] = useState(false);
  const dispatch = useDispatch();

  const formattedDate = (timestamp) => {
    if (!timestamp) {
      return "N/A";
    }
    return format(new Date(timestamp), "do MMMM, yyyy");
  };

  const loadJobPost = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}/jobs/get-job/${localStorage.getItem("email")}`)
      .then((response) => {
        setJobPost(response.data.jobs);
        setSortedJob(response.data.jobs.sort((a, b) => a.createdAt - b.createdAt));
        setLoading(false);
      });
  };
  useEffect(loadJobPost, []);

  const handleSortBy = (e) => {
    setSelectedSort(e.target.value);
    const sorted = [...jobPost];
    setSortedJob(sorted);
    switch (e.target.value) {
      case "latest":
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "name":
        sorted.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle));
        break;
      case "city":
        sorted.sort((a, b) => a.location.localeCompare(b.location));
        break;
      default:
        break;
    }
  };

  const handleJobCardClick = (jobId) => {
    setShowApplicantDetails(false);
    // If the clicked card is already selected, toggle to show latest posts
    if (selectedJobId === jobId) {
      setSelectedJobId(null); // Reset selectedJobId to show latest posts
    } else {
      setSelectedJobId(jobId); // Show job detail for the clicked card
    }
  };

  const handleDelete = async (postID) => {
    try {
      await axios
        .delete(`${baseUrl}/jobs/delete-job/${postID}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(`Job deleted successfully`);
            setSelectedJobId(null);
            loadJobPost();
          }
        });
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  useEffect(() => {
    if (SearchOptions.searchText) {
      let FilteredData = jobPost.filter(
        (job) =>
          job.jobTitle
            .toLowerCase()
            .includes(SearchOptions.searchText.trim().toLowerCase()) ||
          job.employmentType
            .toLowerCase()
            .includes(SearchOptions.searchText.trim().toLowerCase()) ||
          job?.skilRequired?.some((skil) =>
            skil.name
              .toLowerCase()
              .includes(SearchOptions.searchText.trim().toLowerCase())
          ) ||
          job?.location
            .toLowerCase()
            .includes(SearchOptions.searchText.trim().toLowerCase())
      );
      setSortedJob(FilteredData);
    } else {
      setSortedJob(jobPost);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SearchOptions.searchText]);


  const recognition = new window.webkitSpeechRecognition(); // Initialize speech recognition

  recognition.continuous = false; // Enable continuous listening
  recognition.lang = "en-US"; // Set the language for speech recognition

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    setSearchOption({ ...searhOption, "searchText": transcript });
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

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

  const handleSearchInputChange = (e) => {
    setSearchOption({ ...searhOption, [e.target.name]: e.target.value });
    console.log(searhOption);
  };

  useEffect(() => {
    const setTextTimeOut = setTimeout(() => {
      if (searhOption.searchText || searhOption.Location) {
        dispatch(handleSearchData(searhOption));
      } else {
        dispatch(handleSearchData(searhOption));
      }
    }, 1000);
    return () => clearTimeout(setTextTimeOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searhOption]);

  return (
    <div className={hrdashboard.__dashboard_Page}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <header className={hrdashboard.__dashboard_Header}>
            <div className={hrdashboard.__dropdown}>
              <select
                className={hrdashboard.selectOption}
                value={selectedSort}
                onChange={handleSortBy}
              >
                <option className={hrdashboard.options} value="">
                  Sort By
                </option>
                <option value="latest">Latest</option>
                <option value="name">Name</option>
                <option value="city">City</option>
              </select>
            </div>
            {/* <h2 style={{ fontWeight: "700" }}>Dashboard</h2> */}
          </header>

          <div className={hrdashboard.__post_Impression}>
            <header className={hrdashboard.__postImpression_Header}>
              <h3>Post Impressions</h3>
            </header>
            <Carousel
              className={hrdashboard.__post_Section}
              swipeable={true}
              draggable={true}
              showDots={false}
              responsive={responsive}
              infinite={false}
              autoPlay={false}
              autoPlaySpeed={2000}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={500}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
            >
              {jobPost.length > 0 &&
                jobPost.map((data) => (
                  <div
                    className={`${hrdashboard.__posts} ${selectedJobId === data._id ? hrdashboard.activeCard : ""} keep-text-black`}
                    key={data._id}
                    onClick={() => handleJobCardClick(data._id)}
                  >
                    <div className={`${hrdashboard.__postTitle} keep-text-black`}>
                      <img
                        className={hrdashboard.__postLogo}
                        src={data.jobPoster}
                        alt=""
                      />
                      <p className="keep-text-black">
                        {data.jobTitle.slice(0, 15)}...
                        <span className="keep-text-black" style={{ fontSize: "13px", display: "block" }}>
                          <CalculateTimeAgo time={data.createdAt} />
                        </span>
                      </p>
                      <FontAwesomeIcon
                        className={hrdashboard.__btn_PostOpen}
                        icon={faArrowUpRightFromSquare}
                      />
                    </div>
                    <div className={`${hrdashboard.__post_body} `}>
                      <span>{data.location}</span>
                      <span>{data.jobExperience} years</span>
                    </div>
                    <div className={`${hrdashboard.__post_Footer} keep-text-black`}>
                      {" "}
                      <span className="keep-text-black">
                        {data.totalApplication ? data.totalApplication : 0}
                      </span>{" "}
                      application(s)
                    </div>
                  </div>
                ))}
            </Carousel>
          </div>

          {selectedJobId && (
            <div className={hrdashboard.__latest_Post}>
              <section className={hrdashboard.__latestPosts}>
                <HrJobDetail
                  jobId={selectedJobId}
                  ShowApplicantDetails={ShowApplicantDetails}
                  CbToggleDetails={setShowApplicantDetails}
                />
              </section>
            </div>
          )}

          {!selectedJobId && (
            <div className={hrdashboard.__latest_Post}>
              <div className={hrdashboard.__latest_Post_Header}>
                <h3 style={{ margin: ".5em 0" }}>Latest Posts</h3>
                <div className={layout.__searchbar_hr}>
                  <FontAwesomeIcon
                    className={layout.__topbar_Icon}
                    icon={faMagnifyingGlass}
                  />
                  <input
                    className={layout.__input}
                    type="text"
                    name="searchText"
                    id="searchText"
                    placeholder="search post......"
                    onChange={handleSearchInputChange}
                    value={searhOption.searchText}
                  />
                  {isListening ? (
                    <IoMicOutline
                      className={layout.__topbar_Icon}
                      onClick={toggleMicListening}
                    />
                  ) : (
                    <IoMicOffOutline
                      className={layout.__topbar_Icon}
                      onClick={toggleMicListening}
                    />
                  )}
                </div>
              </div>
              <section className={hrdashboard.__latestPosts}>
                {sortedJob.length === 0 ? (
                  <h2>No Job Found</h2>
                ) : (
                  <>
                    {sortedJob.map((jobs, index) => (
                      <div
                        className={`${hrdashboard.__user_Post} ${
                          selectedJobId === jobs._id
                            ? hrdashboard.activeCard
                            : ""
                        }`}
                        key={index}
                        onClick={() => handleJobCardClick(jobs._id)}
                      >
                        <div className={hrdashboard.__user_Post_Header}>
                          <img
                            className={hrdashboard.__user_PostImg}
                            src={user}
                            alt=""
                          />
                          <div>
                            <h3 style={{ fontSize: "20px" }}>
                              {localStorage.name}
                            </h3>
                            <span className={hrdashboard.__user_Position}>
                              HR Executive
                            </span>
                          </div>
                          <FontAwesomeIcon
                            icon={faTrash}
                            title="delete post"
                            className={hrdashboard.createPost_BtnDelete}
                            onClick={() => handleDelete(jobs._id)}
                          />
                        </div>
                        <div className={`${hrdashboard.__user_Post_body}`}>
                          <img
                            className={hrdashboard.__latestPosts_Img}
                            src={jobs.jobPoster}
                            alt=""
                          />
                          <p className={`${hrdashboard.__user_Post_info} `}>
                          {jobs.jobDescription}
                          </p>
                        </div>
                        <div className={`${hrdashboard.__user_Post_Footer} `}>
                        <h6 className={`${hrdashboard.__user_Post_Timestamp}`}>
                        {formattedDate(jobs.createdAt)}
                          </h6>
                          <button className={hrdashboard.__btn_Repost}>
                            Repost
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}
