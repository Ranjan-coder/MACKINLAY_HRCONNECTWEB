import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import searchCandidates from "./RecruiterLayout.module.css";

const SearchCandidates = () => {
  const navigate = useNavigate();
  const [booleanSearch, setBooleanSearch] = useState(false);
  const [filters, setFilters] = useState({
    experience: "",
    country: "",
    state: "",
    city: "",
  });
  const [booleanQuery, setBooleanQuery] = useState("");
  const [keywordSearch, setKeywordSearch] = useState({
    keyword: "",
    mandatoryKeywords: "",
    excludedKeywords: "",
  });

  const handleBooleanSearchToggle = () => setBooleanSearch(!booleanSearch);

  const handleSelectChange = (selectedOption, { name }) => {
    setFilters({ ...filters, [name]: selectedOption.value });
  };

  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const stateOptions = filters.country
    ? State.getStatesOfCountry(filters.country).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    : [];

  const cityOptions = filters.state
    ? City.getCitiesOfState(filters.country, filters.state).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();

    if (booleanSearch) {
      searchParams.set("booleanQuery", booleanQuery);
    } else {
      searchParams.set("keyword", keywordSearch.keyword);
      searchParams.set("mandatoryKeywords", keywordSearch.mandatoryKeywords);
      searchParams.set("excludedKeywords", keywordSearch.excludedKeywords);
    }

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        searchParams.set(key, filters[key]);
      }
    });

    navigate(`/searched-candidates?${searchParams.toString()}`);
  };

  return (
    <div className={searchCandidates.search_container}>
      <h2 className={searchCandidates.search_title}>Search Candidates</h2>
      <Form onSubmit={handleSubmit} className={searchCandidates.search_form}>
        <Form.Check
          type="switch"
          id="boolean-search-toggle"
          label="Boolean Search"
          onChange={handleBooleanSearchToggle}
        />

        {booleanSearch ? (
          <Form.Group
            controlId="booleanSearchQuery"
            className={searchCandidates.search_group}
          >
            <Form.Label>Boolean Search</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter boolean search terms separated by operators"
              value={booleanQuery}
              onChange={(e) => setBooleanQuery(e.target.value)}
              className={searchCandidates.search_textarea}
            />
          </Form.Group>
        ) : (
          <>
            <Form.Group
              controlId="keywordSearch"
              className={searchCandidates.search_group}
            >
              <Form.Label>Keyword Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter keywords separated by commas"
                value={keywordSearch.keyword}
                onChange={(e) =>
                  setKeywordSearch({
                    ...keywordSearch,
                    keyword: e.target.value,
                  })
                }
                className={searchCandidates.search_input}
              />
            </Form.Group>
            <Form.Group
              controlId="mandatoryKeywords"
              className={searchCandidates.search_group}
            >
              <Form.Label>Mandatory Keywords</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mandatory keywords separated by commas"
                value={keywordSearch.mandatoryKeywords}
                onChange={(e) =>
                  setKeywordSearch({
                    ...keywordSearch,
                    mandatoryKeywords: e.target.value,
                  })
                }
                className={searchCandidates.search_input}
              />
            </Form.Group>
            <Form.Group
              controlId="excludedKeywords"
              className={searchCandidates.search_group}
            >
              <Form.Label>Excluded Keywords</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter excluded keywords separated by commas"
                value={keywordSearch.excludedKeywords}
                onChange={(e) =>
                  setKeywordSearch({
                    ...keywordSearch,
                    excludedKeywords: e.target.value,
                  })
                }
                className={searchCandidates.search_input}
              />
            </Form.Group>
          </>
        )}

        <Row>
          <Col>
            <Form.Group
              controlId="experience"
              className={searchCandidates.search_group}
            >
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                placeholder="Eg:- 0 - 1 years"
                value={filters.experience}
                onChange={(e) =>
                  setFilters({ ...filters, experience: e.target.value })
                }
                className={searchCandidates.search_input}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              controlId="location"
              className={searchCandidates.search_group}
            >
              <Form.Label>Location</Form.Label>
              <div className={searchCandidates.location_filter}>
                <Select
                  name="country"
                  options={countryOptions}
                  onChange={handleSelectChange}
                  placeholder="Select Country"
                  className={searchCandidates.select_input}
                  value={countryOptions.find(
                    (option) => option.value === filters.country
                  )}
                />
                <Select
                  name="state"
                  options={stateOptions}
                  onChange={handleSelectChange}
                  placeholder="Select State"
                  className={searchCandidates.select_input}
                  value={stateOptions.find(
                    (option) => option.value === filters.state
                  )}
                  isDisabled={!filters.country}
                />
                <Select
                  name="city"
                  options={cityOptions}
                  onChange={handleSelectChange}
                  placeholder="Select City"
                  className={searchCandidates.select_input}
                  value={cityOptions.find(
                    (option) => option.value === filters.city
                  )}
                  isDisabled={!filters.state}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Button
          variant="primary"
          type="submit"
          className={searchCandidates.search_button}
        >
          Search
        </Button>
      </Form>
    </div>
  );
};

export default SearchCandidates;
