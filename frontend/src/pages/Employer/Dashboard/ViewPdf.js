import React, { useEffect, useState } from "react";
import pageStyle from "./HrDashboard.module.css";
import { GiTireIronCross } from "react-icons/gi";
import axios from "axios";
import Loader from "../../Common-Components/Loaders/Loader";

const newUrl = process.env.REACT_APP_BACKEND_BASE_URL_WITHOUT_API
function ViewPdf({ CbTogglePDF, SelectedResume }) {
  const [resumeError, setError] = useState(false);
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${newUrl}/${SelectedResume?.userResume?.path}`)
      .then((response) => {
        if(response.status === 200){
            setLoading(false);
        }else{
            setLoading(false);
        }
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  }, [SelectedResume.userResume?.path]);

  const handleClosePopup = (e)=>{
    e.preventDefault();
    setLoading(false);
    CbTogglePDF(false)
  }
  return (
    <section className={pageStyle.__viewPDF_mainContainer}>
        <GiTireIronCross
          onClick={handleClosePopup}
          className={pageStyle.__viewPDF_CloseButton}
        />
      <div className={pageStyle.__viewPDFBox}>
        {Loading ? (
          <Loader />
        ) : (
          <>
            {resumeError ? (
              <p className={pageStyle.__viewPDF_errorMSG}>
                No Resume Available
              </p>
            ) : (
              <iframe
                id={pageStyle.__viewPDF}
                src={`${newUrl}/${SelectedResume?.userResume?.path}`}
                width="100%"
                height="100%"
                title="user-resume"
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ViewPdf;
