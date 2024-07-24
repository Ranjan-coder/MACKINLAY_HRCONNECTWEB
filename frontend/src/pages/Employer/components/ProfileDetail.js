import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "react-bootstrap";
import styles from "./RecruiterLayout.module.css";

const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

const ProfileDetail = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/${id}`);
        setProfile(response.data.userDetails);
        setLoading(false);
      } catch (error) {
        setError("Error fetching profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const splitIntoParagraphs = (text) => {
    if (!text) return [];
    const lines = text.split("\n");
    const paragraphs = [];
    for (let i = 0; i < lines.length; i += 3) {
      paragraphs.push(lines.slice(i, i + 2).join("\n"));
    }
    return paragraphs;
  };

  const biographyParagraphs = splitIntoParagraphs(profile && profile.biography);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Profile not found</p>;
  }

  return (
    <div className="container mt-4">
      <h1 style={{ textAlign: "center", marginTop: "-20px" }}>
        Profile Details of {profile.name}!
      </h1>
      <Card className={styles.profile_details_card_container}>
        <div className={styles.profile_details_card_header}>
          <div style={{ display: "flex" }}>
            <div>
              <Card.Img
                variant="top"
                src={
                  profile?.profileImage ??
                  "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
                }
                className={styles.profile_details_card_image}
              />
            </div>
            <div style={{ marginLeft: "20px" }}>
              <Card.Title className={styles.profile_details_card_title}>
                {profile.name}
              </Card.Title>
              <Card.Text className={styles.profile_details_card_text}>
                {profile.job_title ? profile.job_title : profile.course}
              </Card.Text>
            </div>
          </div>
        </div>
        <Card.Body className={styles.profile_details_card_body}>
          <div>
            <Card.Text className={styles.profile_details_card_text}>
              <span className={styles.profile_details_card_name}>Email:</span>{" "}
              {profile.email}
            </Card.Text>
            <Card.Text className={styles.profile_details_card_text}>
              <span className={styles.profile_details_card_name}>Phone: </span>
              {profile.phone_number}
            </Card.Text>
            <Card.Text className={styles.profile_details_card_text}>
              <span className={styles.profile_details_card_name}>
                Experience:{" "}
              </span>
              {profile.experience || "Fresher"}
            </Card.Text>
            <Card.Text className={styles.profile_details_card_text}>
              <span className={styles.profile_details_card_name}>
                Location :
              </span>
              &nbsp;Country: {profile.country} &nbsp;&nbsp;State:-{" "}
              {profile.state} &nbsp;&nbsp;City:- {profile.city}
            </Card.Text>
            <Card.Text className={styles.profile_details_card_text}>
              <span className={styles.profile_details_card_name}>
                Company:{" "}
              </span>
              {profile.company || "No company"}
            </Card.Text>
            <Card.Text className={styles.profile_details_card_text}>
              <span className={styles.profile_details_card_name}>
                University:-{" "}
              </span>
              {profile.college}{" "}
            </Card.Text>
            <Card.Text>
              <span className={styles.profile_details_card_name}>
                Field Of Specialization:-{" "}
              </span>
              {profile.course}
            </Card.Text>
                <div style={{marginBottom:"9px"}}></div>
            <Card.Text className={styles.profile_details_card_text}>
              <span className={styles.profile_details_card_name}>
                Biography:{" "}
              </span>
              {profile.biography ? (
                <>
                  {isExpanded
                    ? biographyParagraphs &&
                      biographyParagraphs.map((paragraph, index) => (
                        <p key={index} className={styles.biography_paragraph}>
                          {paragraph}
                        </p>
                      ))
                    : `${biographyParagraphs[0]}... `}
                  <button
                    onClick={toggleReadMore}
                    className={styles.read_more_button}
                  >
                    {isExpanded ? "read less" : "read more"}
                  </button>
                </>
              ) : (
                "No biography available.."
              )}
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileDetail;
