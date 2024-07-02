import React, { useState, useEffect } from "react";
import { Table, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import interview from './Interview.module.css';
import axios from "axios";
import InterviewStyle from "../../Employer/InterviewScheduled/InterviewScheduled.module.css";
import { useParams } from "react-router-dom";
import no_interview from '../../../Assets/no_interview.png';

const InterviewScheduled = () => {
  const [interviewedUsers, setInterviewedUsers] = useState([]);
  const { HrEmail } = useParams();
  useEffect(() => {
    fetchInterviewedUsers();
},[HrEmail]);
const userProfile=localStorage.getItem('profileImage')
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
  const filteredUsers = interviewedUsers.filter(user => user.userEmail === candidateEmail && 
    (user.interviewType === "walk" || user.interviewType === "virtual" || user.interviewType === "face"));

  const rows = filteredUsers.map((user, index) => {
    return (
      <tr key={index} className={InterviewStyle.Maincontainer}>
        <td className={InterviewStyle.name_column}>
          <div className={InterviewStyle.name_content}>
            <Image
              src={ userProfile?? "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"}
              roundedCircle
              className={InterviewStyle.avatar}
            />
            <span className={InterviewStyle.name}>{user.userName}</span>
          </div>
        </td>
        <td className={InterviewStyle.data_cell}>
          <span className={InterviewStyle.gold_star}>&#9733;</span>
          {user.interviewType}
        </td>
        <td className={InterviewStyle.data_cell}>
          {user.interviewDate}
        </td>
        <td className={InterviewStyle.data_cell}>
          {user.interviewTime}
        </td>
        <td className={InterviewStyle.data_cell}>
          {user.location}
        </td>
      </tr>
    );
  });

  return (
    <>
      {filteredUsers.length > 0 ? (
        <div className={InterviewStyle.table_container}>
          <div className={InterviewStyle.table_border}>
            <div className={InterviewStyle.table_wrapper}>
              <Table bordered hover className={InterviewStyle.custom_table}>
                <thead>
                  <tr>
                    <th className={InterviewStyle.table_header}>Name</th>
                    <th className={InterviewStyle.table_header}>Type</th>
                    <th className={InterviewStyle.table_header}>Date</th>
                    <th className={InterviewStyle.table_header}>Time</th>
                    <th className={InterviewStyle.table_header}>Location</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </div>
          </div>
        </div>
      ) : (
        <div className={interview.__interview_Page}>
          <h2 style={{ color: "grey" }}>No Interviews scheduled yet</h2>
          <img className={InterviewStyle.no_interview} src={no_interview} alt="No Interviews" />
        </div>
      )}
    </>
  );
};

export default InterviewScheduled;
