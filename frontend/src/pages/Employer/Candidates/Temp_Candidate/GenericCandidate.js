import React, { useState } from 'react'
import hrdashboard from "../../Dashboard/HrDashboard.module.css";
import GenericApplicantView from './GenericApplicantView';


export const GenericCandidate = ({type,Users,ShowApplicantDetails, CbToggleDetails}) => {
  // console.log(Users);
  // console.log(type)
  // console.log(job);


  const [selectedUser, setSelectedUsers] = useState([]);
  const[User]=useState(Users)
  // console.log(User);
   const handleUserCardClick = (e, userEmail) => {
    e.preventDefault();
    CbToggleDetails(true);
    setSelectedUsers(userEmail)

  }

  return (
    <>
        <h1>{type} Candidates</h1>
    {
        ShowApplicantDetails ? <GenericApplicantView CbToogleDetails={CbToggleDetails} Users={User} selectedUser={selectedUser} /> : 
        <div className={hrdashboard.__appliedUserList}>
          {
            User?.map((user) => {
              return (
                <div className={hrdashboard.__appliedUsers} key={user._id} onClick={(e) => handleUserCardClick(e, user?._id)}>
                  <div className={hrdashboard.__appliedHeader}>
                    <img className={hrdashboard.__userPF} src={user.profileImage ?? 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg'} alt="" onError={(e) => { e.target.src = `https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg`; e.onError = null; }} />
                    <section>
                      <span style={{ fontSize: '20px' }}><strong>{user.name}</strong></span>
                      <p style={{ fontSize: '15px' }}>{user.biography}</p>
                    </section>
                  </div>
                  <div className={hrdashboard.__appliedBody}>
                    <span>Location - <strong>{user.location}</strong></span>
                    <span>Type - <strong>{user.employmentType}</strong></span>
                  </div>
                  <div>
                    <h6>Skills</h6>
                    <div className={hrdashboard.__appliedSkills}>
                      {
                        user.skills?.map(skill => {
                          return (
                            <span key={skill._id}>{skill.name}</span>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      }

    </>
  )
}
