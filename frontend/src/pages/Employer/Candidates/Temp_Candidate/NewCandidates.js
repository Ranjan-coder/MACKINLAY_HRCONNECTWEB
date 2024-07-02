import React, { useEffect, useState } from 'react';
import './Candidate.css';
import { GenericCandidate } from './GenericCandidate';
import axios from 'axios';
import PdfComp from '../../../Job_Seeker/MyResume/PdfComp';
import { GiTireIronCross } from 'react-icons/gi';
import pageStyle from "../../Dashboard/HrDashboard.module.css";
import toast from 'react-hot-toast';
import { handleRejected, handleSelected } from '../../../../Redux/ReduxSlice';
import { useDispatch } from 'react-redux';
import { io } from "socket.io-client";
import GenericApplicantView from './GenericApplicantView';
import  {Doughnut} from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import Loader from '../../../Common-Components/Loaders/Loader';

const NewCandidates = () => {
Chart.register(ArcElement);
    const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
    const newUrl = process.env.REACT_APP_BACKEND_BASE_URL_WITHOUT_API;
    const socket = io(`${newUrl}`);

    const dispatch = useDispatch();
    const [ShowApplicantDetails, setShowApplicantDetails] = useState(false);
    const [Showpdf, setShowpdf] = useState(false);
    const [resumeUrl, setResumeUrl] = useState(null);
    const [SelectAll, setSelectAll] = useState(false);
    const [ViewProfile, setViewProfile] = useState(false);
    const [SelectedUser, setSelectedUser] = useState(null);
    const [candidatetype, setCandidateType] = useState('Total');
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    // console.log(selectedCandidates);
    const hremail = localStorage.getItem("email");
    const [AllJobs, setAllJobs] = useState([]);
    const [AppliedUsers, setAppliedUsers] = useState([]);
    const [ShortedCandidates,setShortedCandidates]=useState({
        Selected:null,
        Rejected:null,
        Bookmarked:null
    })

    useEffect(() => {
        async function fetchUsers() {
            try {
                const [jobsResponse, bookmarkResponse, shortlistResponse, rejectResponse] = await Promise.all([
                    axios.get(`${baseUrl}/jobs/get-job/${hremail}`),
                    axios.get(`${baseUrl}/user/bookmarkd/get-bookmark/${hremail}`),
                    axios.get(`${baseUrl}/user/shortlisted/get-shortlist/${hremail}`),
                    axios.get(`${baseUrl}/user/rejected/get-rejected/${hremail}`)
                ]);

                const allJobs = jobsResponse?.data?.jobs;
                setAllJobs(allJobs);

                const users = allJobs?.flatMap(job => job.appliedBy);
                setAppliedUsers(users);

                setShortedCandidates({
                    Bookmarked: bookmarkResponse?.data?.bookmarkedUser,
                    Selected: shortlistResponse?.data?.shortlistedUser,
                    Rejected: rejectResponse?.data?.rejectedUser
                });
                setSelectedCandidates([])
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data');
            }
        }


        fetchUsers();
          // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [hremail,baseUrl,dispatch,candidatetype,ShortedCandidates]);


    const handelChangeCandidates = (type) => {
        setCandidateType(type);
        setShowApplicantDetails(false);
        setViewProfile(false)
    };

    function handleShowResume(e, path) {
        e.preventDefault();
        setShowpdf(true);
        setResumeUrl(path);
    }

    function handleClosePopup() {
        setShowpdf(false);
    }

    const handleUserShortlist = async( user) => {
        console.log(user);
        // if (user.status !== 'pending') {
        //     toast.error('Action already performed on this candidate.');
        //     return;
        // }
        dispatch(handleSelected({ email: user.email, jobTitle: user.jobTitle }));
       await axios.post(`${baseUrl}/user/shortlisted/create-shortlist/${localStorage.getItem('email')}`, user).then((response) => {
            if (response.data.success) {
                toast.success(response.data.msg);
                updateUserStatus(user._id, response.data.status);
                setSelectedCandidates([])
            } else {
                toast.error(response.data.msg);
            }
        }).catch((error) => {
            toast.error(`${error.message}`);
        });

        await axios.patch(`${baseUrl}/user/My-jobs/applicationStatus/${user?.email}`, {
            applicationStatus: {
                JobStatus: "Shortlisted",
                StatusText: "Shortlisted",
                updatedAt: Date.now(),
            },
            userJobID: user?.jobID,
        }).then((response) => {
            if (response.data.status) {
                socket.emit("HrSendNotification", JSON.stringify({
                    userEmail: user?.email,
                    NotificatioNText: `Congratulation, you are shortlisted for ${user?.jobTitle} and hr will connect you for further round` ,
                    notificationStatus: 'Unread',
                    updatedAt: Date.now(),
                }));
            }
        });
    };

    const handleUserRejected =async ( user) => {
        // console.log(user);
        // if (user.status !== 'pending') {
        //     toast.error('Action already performed on this candidate.');
        //     return;
        // }
        dispatch(handleRejected({ email: user.email, jobTitle: user.jobTitle }));
       await axios.post(`${baseUrl}/user/rejected/create-reject/${localStorage.getItem('email')}`, user).then((response) => {
            if (response.data.success) {
                toast.success(response.data.msg);
                updateUserStatus(user._id, response.data.status);
                setSelectedCandidates([])
            } else {
                toast.error(response.data.msg);
            }
        }).catch((error) => {
            toast.error(`${error.message}`);
        });

       await axios.patch(`${baseUrl}/user/My-jobs/applicationStatus/${user?.email}`, {
            applicationStatus: {
                JobStatus: "Not-Shortlisted",
                StatusText: "Not-Shortlisted",
                updatedAt: Date.now(),
            },
            userJobID: user?.jobID,
        }).then((response) => {
            if (response.data.status) {
                socket.emit("HrSendNotification", JSON.stringify({
                    userEmail: user?.email,
                    NotificatioNText: `Sorry, You are not shortlisted for ${user?.jobTitle} role by HR.`,
                    updatedAt: Date.now(),
                }));
            }
        });
    };

    const updateUserStatus = (_id, status) => {
        setAppliedUsers(prevState => prevState.map(user => user._id === _id ? { ...user, status } : user));
    };

    const handleSelectCandidate = (e,user) => {
        // if (user.status !== 'pending') {
        //     toast.error('Action already performed on this candidate.');
        //     return;
        // }
        if (selectedCandidates.includes(user)) {
            setSelectedCandidates(selectedCandidates.filter(candidate => candidate !== user));
        } else {
            setSelectedCandidates([...selectedCandidates, user]);
        }
    };

    const handleSelectAll = () => {
        if (SelectAll) {
            setSelectedCandidates([]);
        } 
        else {
            setSelectedCandidates(AppliedUsers.filter(user => user.status !== 'rejected'&& user.status !== 'selected'));
        }
        setSelectAll(!SelectAll);
    };

    const handleBulkAction = (action) => {
        selectedCandidates.forEach(user => {
            if (action === 'shortlist') {
                handleUserShortlist( user);
            } else if (action === 'reject') {
                handleUserRejected( user);
            }
        });
    };

    const handleViewProfile = (e,user) => {
        setViewProfile(!ViewProfile);
        console.log(user);
        setSelectedUser(user);
    };

     // Calculate total and rejected counts
     const totalCandidates = AppliedUsers.length;
     const rejectedCandidates = ShortedCandidates?.Rejected?.length || 0;
     const shortlistedCandidates = ShortedCandidates?.Selected?.length || 0;
     const bookmarkedCandidates = ShortedCandidates?.Bookmarked?.length || 0;

     // Chart data for react-chartjs-2
     const chartData = {
         labels: ['Total Applied', 'Rejected'],
         datasets: [
             {
                 label: 'Candidates',
                 data: [rejectedCandidates, totalCandidates],
                 backgroundColor: ['#36a2eb', '#ff6384']
             }
         ]
     };
     const chartData2 = {
        labels: ['Total Applied', 'shortlisted'],
        datasets: [
            {
                label: 'Candidates',
                data: [shortlistedCandidates, totalCandidates],
                backgroundColor: ['#36a2eb', '#ff6384']
            }
        ]
    };
    const chartData3 = {
        labels: ['Total Applied', 'bookmarked'],
        datasets: [
            {
                label: 'Candidates',
                data: [bookmarkedCandidates, totalCandidates],
                backgroundColor: ['#36a2eb', '#ff6384']
            }
        ]
    };



     // Chart options
     const chartOptions = {
         responsive: true,
         maintainAspectRatio: false
     };

    return (
        <>{AppliedUsers && AllJobs?<div className="main_candidate">
            <div className='candidate-main'>
                <div className={candidatetype === 'Total' ? 'candidate-sub-main-2' : 'candidate-sub-main-1'} id='bookmark-floating-2' onClick={() => handelChangeCandidates('Total')}>
                    <div>
                        <p>Total Applications</p>
                    </div>
                    <div className='candidate-progress-data'>
                        <h2>{AppliedUsers.length}</h2>
                    </div>
                </div>
                <div
                    className={
                        candidatetype === 'Rejected'
                            ? 'candidate-sub-main-2'
                            : 'candidate-sub-main-1'
                    }
                    id="bookmark-floating-2"
                    onClick={() => handelChangeCandidates('Rejected')}
                >
                    <div>
                        <p>Rejected Applications</p>
                    </div>
                    <div className="candidate-progress-data">
                        <h2>{rejectedCandidates}</h2>
                        <div className="progress-ring">
                            <Doughnut data={chartData} options={chartOptions} />
                        </div>
                    </div>

                </div>

                <div className={candidatetype === 'Shortlisted' ? 'candidate-sub-main-2' : 'candidate-sub-main-1'} id='bookmark-floating-2' onClick={() => handelChangeCandidates('Shortlisted')}>
                    <div>
                        <p>Shortlisted Applications</p>
                    </div>
                    <div className='candidate-progress-data'>
                        <h2>{shortlistedCandidates}</h2>
                        <div className="progress-ring">
                            <Doughnut data={chartData2} options={chartOptions} />
                        </div>
                    </div>
                </div>
                <div className={candidatetype === 'Bookmarked' ? 'candidate-sub-main-2' : 'candidate-sub-main-1'} id='bookmark-floating-2' onClick={() => handelChangeCandidates('Bookmarked')}>
                    <div>
                        <p>Profile Bookmarked</p>
                    </div>
                    <div className='candidate-progress-data'>
                        <h2>{bookmarkedCandidates}</h2>
                        <div className="progress-ring">
                            <Doughnut data={chartData3} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
            {candidatetype === "Rejected" && <GenericCandidate type={candidatetype} Users={ShortedCandidates.Rejected} job={AllJobs} ShowApplicantDetails={ShowApplicantDetails} CbToggleDetails={setShowApplicantDetails} bookmarkUser={ShortedCandidates.Bookmarked}/>}
            {candidatetype === "Shortlisted" && <GenericCandidate type={candidatetype} Users={ShortedCandidates.Selected} job={AllJobs} ShowApplicantDetails={ShowApplicantDetails} CbToggleDetails={setShowApplicantDetails} bookmarkUser={ShortedCandidates.Bookmarked} />}
            {candidatetype === "Bookmarked" && <GenericCandidate type={candidatetype} Users={ShortedCandidates.Bookmarked} job={AllJobs} ShowApplicantDetails={ShowApplicantDetails} CbToggleDetails={setShowApplicantDetails} bookmarkUser={ShortedCandidates.Bookmarked} />}
            {ViewProfile && !ShowApplicantDetails && <GenericApplicantView Users={AppliedUsers} selectedUser={SelectedUser} ShowApplicantDetails={ShowApplicantDetails} CbToogleDetails={setViewProfile} bookmarkUser={ShortedCandidates?.Bookmarked}/>}
            {candidatetype === 'Total' && !ViewProfile && (
                <div>
                    <div className='candidate-main-2'>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1%", marginTop: "1%" }}>
                            <h2>Total Candidates</h2>
                        </div>
                        <div>
                            <button className={selectedCandidates.length !== 0?'bulkAction_btn select':"block"} onClick={() => handleBulkAction('shortlist')} disabled={selectedCandidates.length === 0}>Shortlist </button>
                            <button className={selectedCandidates.length !== 0?'bulkAction_btn reject':"block"} onClick={() => handleBulkAction('reject')} disabled={selectedCandidates.length === 0}>Reject </button>
                            <table className='candidate-table'>
                                <thead style={{ backgroundColor: "#fa7902", height: "2%" }}>
                                    <tr>
                                        <th><input type='checkbox' id='selectAll' checked={SelectAll} onChange={handleSelectAll}  /></th>
                                        <th>Candidate Name</th>
                                        <th>Stages</th>
                                        <th>Applied Role</th>
                                        <th>Applied Date</th>
                                        <th>Resumes</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AppliedUsers.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input type='checkbox' checked={selectedCandidates.includes(item)} onChange={(e) => handleSelectCandidate(e,item)} disabled={item.status?true:false} />
                                            </td>
                                            <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <img src={item.profileImage ?? 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg'} height="50px" alt='pro' />
                                                <p>{item.name}</p>
                                            </td>
                                            <td>{item.status?item.status:"pending"}</td>
                                            <td>{item.jobTitle}</td>
                                            <td>{item.AppliedDate}</td>
                                            <td key={index} style={{ cursor: "pointer" }} onClick={(e) => handleShowResume(e, item.resume[0].url)}>{item.resume[0].filename.split('.'||"-")[0]}</td>
                                            <td><button className='bulkAction_btn' onClick={(e) => handleViewProfile(e,item?.email)} >View Profile</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {Showpdf && (
                                <section className={pageStyle.__viewPDF_mainContainer}>
                                    <GiTireIronCross onClick={handleClosePopup} className={pageStyle.__viewPDF_CloseButton} />
                                    {resumeUrl && (
                                        <a href={resumeUrl} download="Resume.pdf" className={pageStyle.__viewPDF_downloadButton}>
                                            <i className="fa-solid fa-download"></i> Download
                                        </a>
                                    )}
                                    <div className={pageStyle.__viewPDFBox}>
                                        {resumeUrl ? (
                                            <PdfComp pdf={resumeUrl} pagesize='full' />
                                        ) : (
                                            <p className={pageStyle.__viewPDF_errorMSG}>No Resume Available</p>
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
:<Loader/>}</>
    );
}

export default NewCandidates;