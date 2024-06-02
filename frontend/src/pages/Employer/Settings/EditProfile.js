import React, { useEffect, useRef, useState } from "react";
import styleSheet from "../Settings/EditProfile.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loader from "../../Common-Components/Loaders/Loader";
import { MdModeEdit } from "react-icons/md";
const baseURL = process.env.REACT_APP_BACKEND_BASE_URL;

function EditProfile() {
  const imgRef = useRef(null);
  const { email, name } = useSelector((state) => state.Assessment.currentUser);
  const [IsLoading, setIsLoading] = useState(false);
  const [selectedImgPath, setSelectedImg] = useState(null)

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  // ! Onchange event for form input
  const handleOnChange = (e) => {
    let { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : (userDetails.name?.split(" ")[0] ?? "");
      const lastName = name === "lastName" ? value : (userDetails.name?.split(" ")[1] ?? "");
      const fullName = `${firstName} ${lastName}`;
      setUserDetails({ ...userDetails, name: fullName });
    }

    if (name === "profileImage") {
      if (e.target?.files[0]?.type.split("/")[0] === "image") {
        setUserDetails({
          ...userDetails,
          [name]: URL.createObjectURL(e.target.files[0]),
        });
        setSelectedImg(e.target.files[0]);
      } else {
        toast.error("Invalid image");
      }
    }
  };


  // ! handleSavechanges click
  const handleSaveChangesClick = (e) => {
    e.preventDefault();
    setIsLoading(true)
    const formData = new FormData();
    formData.append("name", userDetails?.name);
    formData.append("email", userDetails?.email);
    formData.append("profileImage", selectedImgPath);

    axios.patch(`${baseURL}/hr/update-hr/${email}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then((response) => {
      if (response.data.success) {
        toast.success(response.data.msg);
        setSelectedImg(null);
        loadUserData()
      } else {
        toast.error(response.data.msg);
        setSelectedImg(null);
        loadUserData()
      }

    }).catch((error) => {
      console.log(error)
      toast.error(`Something went wrong : ${error.msg}`);
      loadUserData();
    })

  }

  //! Load user data by using his email address
  const loadUserData = () => {
    setIsLoading(true);
    axios
      .get(`${baseURL}/hr/get-hr?email=${email}`)
      .then((response) => {
        if (response.data) {
          console.log(response.data.hrDetails)
          const { name, email, profileImage } = response.data.hrDetails

          setUserDetails({ name, email,profileImage});

          localStorage.setItem("profileImage", response.data.hrDetails?.profileImage);
          localStorage.setItem("name", response.data.hrDetails?.name);
          localStorage.setItem("email", response.data.hrDetails?.email);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error)
        setIsLoading(false);
        toast.error(`Something went wrong ${error.message}`);
      });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadUserData, [email]);

  return (
    <main className={styleSheet.mainContainer}>
      {IsLoading ? (
        <Loader />
      ) : (
        <form className={styleSheet.editProfile__form} onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">

          <div className={styleSheet.Form__profileContainer}>
            <label htmlFor="profileImage" className={styleSheet.form__userLabel}>Profile Picture</label>
            <div className={styleSheet.Form__profileBox}>
              <img src={userDetails?.profileImage ?? 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg'} alt={`${name}-Profile`} className={styleSheet.Form__userProfile} onError={(e) => { e.target.src = `https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg`; e.onError = null; }} />
              <p className={styleSheet.Form__profile_editICON_Box} title="Edit Profile" onClick={() => imgRef.current.click()}>
                <MdModeEdit className={styleSheet.Form__profile_editICON} />
              </p>
              <input type="file" name="profileImage" hidden ref={imgRef}
                accept="image/*" id="profileImage" className={styleSheet.Form__input} onChange={handleOnChange} />
            </div>
          </div>

          {/* First name and last name */}
          <div className={`${styleSheet.Form__inputRows_Primary}`}>
            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="firstName" className={styleSheet.Form__inputBox_Label}> First Name</label>
              <input type="text" value={userDetails.name?.split(" ")[0] ?? ""} name="firstName" id="firstName" placeholder="Enter your first name" className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
            </div>

            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="lastName" className={styleSheet.Form__inputBox_Label}>Last Name</label>
              <input type="text" name="lastName" value={userDetails.name?.split(" ")[1] ?? ""} id="lastName" placeholder="Enter your last name" className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
            </div>
          </div>

          {/* Email address */}
          <div className={`${styleSheet.Form__inputRows_Secondry}`}>
            <label htmlFor="email" className={styleSheet.Form__inputBox_Label}> Email Address</label>
            <input type="email" value={userDetails.email} name="email" id="email" placeholder="Enter your email address" className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
          </div>

          {/* Phone number */}
          {/* <div className={`${styleSheet.Form__inputRows_Secondry}`}>
            <label htmlFor="phone" className={styleSheet.Form__inputBox_Label}>Phone</label>
            <input type='tel' pattern="[0-9]{10}" value={userDetails.phone_number} name="phone_number" id="phone" placeholder="Enter your phone number" className={styleSheet.Form__input} onChange={handleOnChange} maxLength="10" autoComplete="off" />
          </div>
 */}
          {/* WEbsites*/}
          {/* <div className={`${styleSheet.Form__inputRows_Secondry}`}>
            <label htmlFor="website" className={styleSheet.Form__inputBox_Label}>Website</label>
            <input type="text" value={userDetails.website} name="website" id="website" placeholder="Enter your website link" className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
          </div> */}

          {/* marital status and Date of birth */}
          {/* <div className={`${styleSheet.Form__inputRows_Primary}`}>

            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="maritalStatus" className={styleSheet.Form__inputBox_Label}> Marital Status</label>
              <select id="maritalStatus" value={userDetails.marital_status} className={`${styleSheet.Form__input} ${styleSheet.Form__Select_input}`} name="marital_status" onChange={handleOnChange} autoComplete="off">
                <option value="">Select your marital status</option>
                <option value="single" className={styleSheet.Form_SelectInput_options}>single</option>
                <option value="married" className={styleSheet.Form_SelectInput_options}>married</option>
                <option value="widowed" className={styleSheet.Form_SelectInput_options}>widowed</option>
                <option value="divorced" className={styleSheet.Form_SelectInput_options}>divorced</option>
                <option value="separated" className={styleSheet.Form_SelectInput_options}>separated</option>
              </select>
            </div>

            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="dob" className={styleSheet.Form__inputBox_Label}>Date of birth</label>
              <input type="date" name="dob" id="dob" value={userDetails.dob?.split("T")[0]} className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
            </div>
          </div>
 */}
          {/* Gender and nationality */}
          {/* <div className={`${styleSheet.Form__inputRows_Primary}`}>
            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="gender" className={styleSheet.Form__inputBox_Label}> Gender</label>
              <select value={userDetails.gender} className={`${styleSheet.Form__input} ${styleSheet.Form__Select_input}`} id="gender" onChange={handleOnChange} name="gender" autoComplete="off">
                <option value="">Select your gender</option>
                <option value="Male" className={styleSheet.Form_SelectInput_options}>male</option>
                <option value="Female" className={styleSheet.Form_SelectInput_options}>female</option>
                <option value="Other" className={styleSheet.Form_SelectInput_options}>other</option>
              </select>
            </div>

            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="nationality" className={styleSheet.Form__inputBox_Label}> nationality</label>
              <select value={userDetails.country} name="country" className={`${styleSheet.Form__input} ${styleSheet.Form__Select_input}`} id="nationality" onChange={handleOnChange} autoComplete="off">
                <option value="">Select your nationality</option>
                <option value="Indian" className={styleSheet.Form_SelectInput_options}>indian</option>
                <option value="Non-Indian" className={styleSheet.Form_SelectInput_options}>non-indian</option>
              </select>
            </div>
          </div>
 */}
          {/* College and Course */}
          {/* <div className={`${styleSheet.Form__inputRows_Primary}`}>
            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="college" className={styleSheet.Form__inputBox_Label}> university/College</label>
              <input type="text" name="college" value={userDetails.college} id="college" placeholder="Enter College or university name" className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
            </div>

            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="course" className={styleSheet.Form__inputBox_Label}>course</label>
              <input type="text" name="course" value={userDetails.course} id="course" placeholder="Enter course name" className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
            </div>
          </div>
 */}
          {/* Percentage */}
          {/* <div className={`${styleSheet.Form__inputRows_Secondry}`}>
            <label htmlFor="percentage" className={styleSheet.Form__inputBox_Label}> percentage</label>
            <input type="number" value={userDetails.percentage} name="percentage" id="percentage" placeholder="Enter your percentage" className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
          </div> */}

          {/* Skils */}
          {/* <div className={`${styleSheet.Form__inputRows_Secondry}`}>
            <label htmlFor="skills" className={styleSheet.Form__inputBox_Label}> Skills <span className={styleSheet.Form__inputBox_Label_Info}>Press <strong>ENTER</strong> for register the skil set</span></label>
            {
              SkilsTags?.length > 0 && <ul className={styleSheet.Form_skilsList}>
                {
                  SkilsTags?.map((skils, index) => {
                    return <li key={index} className={styleSheet.Form_skilsList_Item}>{skils} <RxCross2 onClick={(e) => handleRemoveSkils(e, skils)} className={styleSheet.Form_skilsList_Item_DeleteButton} /> </li>
                  })
                }
              </ul>
            }
            <input type="text" name="skills" id="skills" placeholder="Enter your skils" className={styleSheet.Form__input} autoComplete="off" onKeyDown={handleSkilsKeyDown} value={Skils} onChange={(e) => setSkils(e.target.value)} />
          </div> */}

          {/*Work Exp optional part  */}
          {/* <h2 className={styleSheet.Form_WorkEXP_heading}>Work experience (Optional)</h2> */}

          {/* {job title and company name} */}
          {/* <div className={`${styleSheet.Form__inputRows_Primary}`}>
            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="jobTitle" className={styleSheet.Form__inputBox_Label}> Job Title</label>
              <input type="text" name="job_title" value={userDetails.job_title ?? ""} id="jobTitle" placeholder="Enter job title" className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
            </div>

            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="companyName" className={styleSheet.Form__inputBox_Label}>Company Name</label>
              <input type="text" name="company" value={userDetails.company ?? ""} id="companyName" placeholder="Enter company name" className={styleSheet.Form__input} onChange={handleOnChange} autoComplete="off" />
            </div>
          </div> */}

          {/* {Compnay start and end date} */}
          {/* <div className={`${styleSheet.Form__inputRows_Primary}`}>
            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="company_start_date" className={styleSheet.Form__inputBox_Label}>Start Date</label>
              <input type="date" name="company_start_date" id="company_start_date" value={userDetails.company_start_date?.split("T")[0] ?? ""} className={styleSheet.Form__input} onChange={handleOnChange} />
            </div>

            <div className={styleSheet.Form__inputBox}>
              <label htmlFor="company_end_date" className={styleSheet.Form__inputBox_Label}>End Date</label>
              <input type="date" name="company_end_date" id="company_end_date" value={userDetails.company_end_date?.split("T")[0] ?? ""} className={styleSheet.Form__input} onChange={handleOnChange} />
            </div>
          </div>
 */}
          {/* About the user */}
          {/* <div className={`${styleSheet.Form__inputRows_Secondry}`} style={{ "width": "100%" }}>
            <label htmlFor="about" className={styleSheet.Form__inputBox_Label}> About</label>
            <textarea className={styleSheet.Form_About_textArea} placeholder="Write about yourself" id="about" name="biography" value={userDetails?.biography} onChange={handleOnChange} autoComplete="off"></textarea>
          </div>
 */}
          <div className={styleSheet.Form__buttonContainer}>
            <button onClick={handleSaveChangesClick} type="button" className={styleSheet.Form__saveChangesButton}>Save Changes</button>
          </div>

        </form>
      )}
    </main>
  );
}

export default EditProfile;
