import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Image, Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import tableImage from "../../../Assets/tableImage.PNG";
import InterviewStyle from "./InterviewScheduled.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarXmark, faCalendarCheck, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

const InterviewScheduled = () => {
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const rowData = [
    {
      name: "Charlie Kristen",
      rating: "2.0",
      experience: "2 years",
      role: "Sr. UX Designer",
      rounds: "1st Round",
      score: "50/100",
    },
  ];

  const handleInterview = () => {
    nav('/schedule-interview');
  };

  const handleShowModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFeedback("");
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch('/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateName: selectedCandidate.name,
          candidateEmail: 'candidate@example.com', // Replace with actual email
          feedback,
        }),
      });

      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
    handleCloseModal();
  };

  const rows = Array.from({ length: 12 }, (_, index) => (
    <tr key={index}>
      <td className={InterviewStyle.name_column}>
        <div className={InterviewStyle.name_content}>
          <Image src={tableImage} roundedCircle className={InterviewStyle.avatar} />
          <span className={InterviewStyle.name}>{rowData[index % rowData.length].name}</span>
        </div>
      </td>
      <td className={InterviewStyle.data_cell}>
        <span className={InterviewStyle.gold_star}>&#9733;</span>
        {rowData[index % rowData.length].rating}
      </td>
      <td className={InterviewStyle.data_cell}>
        {rowData[index % rowData.length].experience}
      </td>
      <td className={InterviewStyle.data_cell}>{rowData[index % rowData.length].role}</td>
      <td className={InterviewStyle.data_cell}>{rowData[index % rowData.length].rounds}</td>
      <td className={InterviewStyle.data_cell}>{rowData[index % rowData.length].score}</td>
      <td>
        <button
          style={{
            border: "none",
            borderRadius: "5px",
            backgroundColor: "rgba(0, 183, 7, 1)",
            color: 'white',
            fontSize: "12px",
            padding: "5px"
          }}
          onClick={handleInterview}
        >
          Schedule Interview
        </button>
      </td>
      <td>
        <button className={InterviewStyle.writeFeedback_Btn}       
          onClick={() => handleShowModal(rowData[index % rowData.length])}
        >
          Write Feedback
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <div className={InterviewStyle.cardcontainer}>
        <div className={InterviewStyle.cardcontainer1}>
          <div className={InterviewStyle.childbox1}><FontAwesomeIcon icon={faCalendarDays} /></div>
          <div className={InterviewStyle.childbox1text}>Upcoming Event</div>
        </div>
        <div className={InterviewStyle.cardcontainer1}>
          <div className={InterviewStyle.childbox2}><FontAwesomeIcon icon={faCalendarXmark} /></div>
          <div className={InterviewStyle.childbox2text}>Meeting Cancelled</div>
        </div>
        <div className={InterviewStyle.cardcontainer1}>
          <div className={InterviewStyle.childbox3}><FontAwesomeIcon icon={faCalendarCheck} /></div>
          <div className={InterviewStyle.childbox3text}>Meeting Done</div>
        </div>
      </div>
      <div className={InterviewStyle.table_container}>
        <div className={InterviewStyle.table_border}>
          <div className={InterviewStyle.table_wrapper}>
            <Table bordered hover className={InterviewStyle.custom_table}>
              <thead>
                <tr>
                  <th className={InterviewStyle.table_header}>Name</th>
                  <th className={InterviewStyle.table_header}>Rating</th>
                  <th className={InterviewStyle.table_header}>Experience</th>
                  <th className={InterviewStyle.table_header}>Role</th>
                  <th className={InterviewStyle.table_header}>Rounds</th>
                  <th className={InterviewStyle.table_header}>Score</th>
                  <th className={InterviewStyle.table_header}></th>
                  <th className={InterviewStyle.table_header}></th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Write Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="feedback">
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSendEmail}>
            Send Email
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InterviewScheduled;
