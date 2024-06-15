import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { GiTireIronCross } from "react-icons/gi";
import Loader from "../../Common-Components/Loaders/Loader";

import pageStyle from "./HrDashboard.module.css";
import PdfComp from "../../Job_Seeker/MyResume/PdfComp";

import toast from 'react-hot-toast'


const newUrl = process.env.REACT_APP_BACKEND_BASE_URL_WITHOUT_API;

function ViewPdf({ CbTogglePDF, SelectedResume }) {
  const [resumeError, setResumeError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (SelectedResume && SelectedResume.userResume) {

        setLoading(true);
        try {
          const path = SelectedResume.userResume.path;
          const url = `${newUrl}/${path}`; // Ensure this points to Cloudinary URL
          setResumeUrl(url);
        } catch (error) {
          console.error('Error viewing resume:', error);
          setResumeError(true);
          toast.error("Error loading Resume");

        const email = SelectedResume.userEmail;
        const filename = SelectedResume.userResume.filename;

        setLoading(true);
        try {
          const response = await axios.get(`${newUrl}/resume/view/${email}/${filename}`, {
            responseType: 'blob', // Important to handle binary data
          });
          if (response.status === 200) {
            // Create a URL for the PDF blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setResumeUrl(url);
          } else {
            setResumeError(true);
          }
        } catch (error) {
          console.error('Error viewing resume:', error);
          setResumeError(true);

        } finally {
          setLoading(false);
        }
      }
    };


    fetchResume();
  }, [SelectedResume]);



    fetchResume();
  }, [SelectedResume]);


  const handleClosePopup = (e) => {
    e.preventDefault();
    setLoading(false);
    CbTogglePDF(false);
  };

  if (loading) {

    return <Loader />;
  }

  if (resumeError) {
    toast.error("Error loading Resume");
    return null;
  }


    return <div>Loading...</div>;
  }

  if (resumeError) {
    return toast.error("Error loading Resume");
  }


  return (
    <section className={pageStyle.__viewPDF_mainContainer}>
      <GiTireIronCross
        onClick={handleClosePopup}
        className={pageStyle.__viewPDF_CloseButton}
      />

      {resumeUrl && (
        <a href={resumeUrl} download="Resume.pdf" className={pageStyle.__viewPDF_downloadButton}>
         <i className="fa-solid fa-download"></i> Download
        </a>
      )}
      <div className={pageStyle.__viewPDFBox}>
        {resumeUrl ? (
          <PdfComp pdf={resumeUrl} pagesize="full" />
        ) : (
          <p className={pageStyle.__viewPDF_errorMSG}>
            No Resume Available
          </p>

      <div className={pageStyle.__viewPDFBox}>
        {loading ? (
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
                src={resumeUrl}
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

