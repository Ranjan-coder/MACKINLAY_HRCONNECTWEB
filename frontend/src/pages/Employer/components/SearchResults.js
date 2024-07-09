import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import classNames from "classnames";
import SearchResultStyle from "./RecruiterLayout.module.css";

const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

const SearchResults = () => {
  const [profiles, setProfiles] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${baseUrl}/hr/search-candidates`, {
          params: Object.fromEntries(searchParams.entries()),
        });
        setProfiles(response.data.profiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className={SearchResultStyle.results_container}>
      <h2 className={SearchResultStyle.results_title}>Search Results</h2>
      <div
        className={classNames(
          SearchResultStyle.results_list,
          "d-flex",
          "flex-wrap",
          "justify-content-center"
        )}
      >
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <Card
              key={profile._id}
              className={classNames(SearchResultStyle.result_card, " m-3")}
            >
              <div className={SearchResultStyle.card_image_container}>
                <Card.Img
                  variant="top"
                  src={
                    profile?.profileImage ??
                    "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
                  }
                  className={SearchResultStyle.profile_image}
                />
              </div>
              <Card.Body>
                <Card.Title className={SearchResultStyle.card_title}>
                  {profile.name}
                </Card.Title>
                <Card.Text className={SearchResultStyle.card_text}>
                  {profile.job_title ? profile.job_title : profile.course}
                </Card.Text>
                <Button
                  as={Link}
                  to={`/profile/${profile._id}`}
                  variant="primary"
                  className={SearchResultStyle.view_profile_btn}
                >
                  View Profile
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className={SearchResultStyle.no_results_text}>
            No profiles found.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
