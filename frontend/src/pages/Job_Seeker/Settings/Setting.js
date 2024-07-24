import React, { useState, useEffect } from "react";
import SettingStyle from "../Settings/Setting.module.css";
import { useNavigate } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { FaSync } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import { TbUserExclamation } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { handleUserLogOut } from "../../../Redux/ReduxSlice";
import toast from "react-hot-toast";
import axios from "axios";

function Setting() {
  const { name, profileImage } = useSelector(
    (state) => state.Assessment.currentUser
  );
  const [settingtype, setsettingtype] = useState("");
  const { email } = useSelector((state) => state.Assessment.currentUser);
  const [darkModePopup, setDarkModePopup] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") || "Device settings"
  );
  const navi = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    applyDarkMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);

  const applyDarkMode = () => {
    const body = document.body;
    if (darkMode === "Always on") {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else if (darkMode === "Always off") {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    } else {
      body.classList.remove("dark-mode");
      body.classList.remove("light-mode");
    }
  };

  const handleDarkModeSelection = (mode) => {
    setDarkMode(mode);
    localStorage.setItem("darkMode", mode);
    setDarkModePopup(false);
    applyDarkMode();
  };

  const [del, setDel] = useState(false);

  const handleDeleteAccount = () => {
    setDel(true);
  };

  const handlePopupClose = () => {
    setDel(false);
  };

  const handleAgree = () => {
    axios
      .delete(`http://localhost:8585/api/delete-user/${email}`)
      .then((response) => {
        if (response.data.success) {
          toast.success(`${response.data.msg}`);
          dispatch(handleUserLogOut());
          navi("/login");
        } else {
          toast.error("Try Again !!!");
          handlePopupClose();
        }
      })
      .catch((err) => {
        toast.error(`${err.message}`);
        handlePopupClose();
      });
  };

  const handleDoneClick = () => {
    setsettingtype("");
  };

  const renderSettingContent = () => {
    switch (settingtype) {
      // 'Setting/Profile':
      default:
        return (
          <div className={SettingStyle.profile_designs}>
            <div className={SettingStyle.Profile_cont2}>
              <div className={SettingStyle.Profile_cont2_One}>
                <p><FaSync /></p>
                <span>Sync</span>
              </div>
              <div className={SettingStyle.Profile_cont2_One} onClick={() => setsettingtype("Setting/JobPreference")}>
                <p>
                  <RiUserSettingsFill />
                </p>
                <span>Job Preference</span>
              </div>
              <div className={SettingStyle.Profile_cont2_One} onClick={() => navi("/settings/editprofile")}>
                <p>
                  <TbUserExclamation />
                </p>
                <span>Personal Info</span>
              </div>
            </div>
          </div>
        );

      case "Setting/JobPreference":
        return (
          <div className={SettingStyle.jobPreferenceSection}>
            <h3>Job Preference</h3>
            <div className={SettingStyle.jobInput}>
              <label>
                Job Titles<span>*</span>
              </label>
              <input type="text" placeholder="Enter job titles" />
            </div>
            <div className={SettingStyle.jobInput}>
              <label>
                Location Types<span>*</span>
              </label>
              <select>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className={SettingStyle.jobInput}>
              <label>
                Start Date<span>*</span>
              </label>
              <div className={SettingStyle.startDates}>
                <label>
                  <input type="checkbox" />
                  <span>Immediately, I am actively applying</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>Available,To join in 15 days</span>
                </label>

                <label>
                  <input type="checkbox" />

                  <span>Available,To join in 30 days</span>
                </label>

                <label>
                  <input type="checkbox" />
                  <span>Flexible, I am casually looking</span>
                </label>
              </div>
            </div>
            <div className={SettingStyle.jobInput}>
              <label>
                Employment Types<span>*</span>
              </label>
              <div>
                <label>
                  <input type="checkbox" />
                  <span>Full-time</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>Part-time</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>Contract</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>Internship</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>Temporary</span>
                </label>
              </div>
            </div>
            <button
              className={SettingStyle.doneButton}
              onClick={handleDoneClick}
            >
              Done
            </button>
          </div>
        );

      case "Setting/privacy":
        return (
          <div className={SettingStyle.privacySettings}>
            <h3>Privacy Settings</h3>
            <section>
              <h4>Information We Collect</h4>
              <p>
                We collect information to provide better services to all our
                users. This may include:
              </p>
              <li>Personal information such as name and email address.</li>
              <li>Usage data such as browsing history and interactions with ourplatform.</li>
              <li>Device information such as IP address and browser type.</li>
            </section>
            <section>
              <h4>How We Use Information</h4>
              <p>
                We use the information we collect from all of our services to
                provide, maintain, protect, and improve them. This includes:
              </p>
              <li>Customizing user experience and delivering personalized content.</li>
              <li>Analyzing trends and usage patterns to enhance our services.</li>
              <li>Preventing fraudulent activities and ensuring security.</li>
            </section>
            <section>
              <h4>Information You Share</h4>
              <p>
                Our services let you share information with others. Remember
                that when you share information publicly, it may be indexed by
                search engines.
              </p>
            </section>
            <section>
              <h4>Accessing and Updating Your Personal Information</h4>
              <p>
                Whenever you use our services, we aim to provide you with access
                to your personal information. You can review, edit, or delete
                your data through your account settings.
              </p>
            </section>
            <section>
              <h4>Information We Share</h4>
              <p>
                We do not share personal information with companies,
                organizations, and individuals outside of our company unless one
                of the following circumstances applies:
              </p>
              <li>With your consent</li>
              <li>For external processing by trusted service providers</li>
              <li>For legal reasons such as complying with legal obligations orresponding to legal requests</li>
            </section>
            <button className={SettingStyle.__pfDeleteBtn} onClick={handleDeleteAccount}>
              {" "}<GoTrash /> Delete Account
            </button>
            {del && (
              <div className={SettingStyle.__popupDelete}>
                <p>Are you sure you want to delete ??</p>
                <p>
                  <button className={SettingStyle.__btnAgree} onClick={handleAgree} >
                    Agree
                  </button>
                  <button className={SettingStyle.__btnCancel} onClick={handlePopupClose} >
                    Cancel
                  </button>
                </p>
              </div>
            )}
          </div>
        );

      case "Setting/service":
        return (
          <div className={SettingStyle.serviceSettings}>
            <h3>Service Settings</h3>
            <section>
              <h4>Terms of Service</h4>
              <p>
                By using our platform, you agree to our Terms of Service. Please
                review them carefully to understand your rights and
                responsibilities.
              </p>
              <a href="/terms-of-service">Read Terms of Service</a>
            </section>
            <section>
              <h4>Acceptable Use Policy</h4>
              <p>
                Our Acceptable Use Policy outlines the rules and guidelines for
                using our platform. It covers acceptable behavior, content
                restrictions, and prohibited activities.
              </p>
              <a href="/acceptable-use-policy">Read Acceptable Use Policy</a>
            </section>
            <section>
              <h4>Privacy Policy</h4>
              <p>
                Our Privacy Policy explains how we collect, use, and protect
                your personal information. It also describes your rights and
                choices regarding your data.
              </p>
              <a href="/privacy-policy">Read Privacy Policy</a>
            </section>
          </div>
        );

      case "Setting/appearance":
        return (
          <div className={`${SettingStyle.Profile_cont2}`}>
            <div
              className={SettingStyle.Profile_cont2_One}
              onClick={() => setDarkModePopup(true)}
            >
              <span>Dark Mode</span>
            </div>
            <div className={SettingStyle.Profile_cont2_One}>
              <span>Font Size</span>
            </div>
            <div className={SettingStyle.Profile_cont2_One}>
              <span>Any other appearance button</span>
            </div>
          </div>
        );

      case "Setting/notification":
        return (
          <div
            className={`${SettingStyle.notification} ${SettingStyle.Profile_cont1}`}
          >
            <div className={SettingStyle.checkboxex}>
              <label htmlFor="check1">Option 1</label>
              <div className={SettingStyle.checkbox1}>
                <input
                  type="checkbox"
                  id="check1"
                  className={SettingStyle.click}
                ></input>
                <span>Allow Notification</span>
              </div>
            </div>
            <div className={SettingStyle.checkboxex}>
              <label htmlFor="check2">Option 2</label>
              <div className={SettingStyle.checkbox1}>
                <input
                  type="checkbox"
                  id="check2"
                  className={SettingStyle.click}
                ></input>
                <span>Allow Notification</span>
              </div>
            </div>
            <div className={SettingStyle.checkboxex}>
              <label htmlFor="check3">Option 3</label>
              <div className={SettingStyle.checkbox1}>
                <input
                  type="checkbox"
                  id="check3"
                  className={SettingStyle.click}
                ></input>
                <span>Allow Notification</span>
              </div>
            </div>
          </div>
        );

      case "Setting/support":
        return (
          <div className={SettingStyle.supportContent}>
            <h3>Support</h3>
            <p>
              If you need any assistance or have any questions, please don't
              hesitate to reach out to us.
            </p>
            <div className={SettingStyle.contactDetails}>
              <h4>Contact Details</h4>
              <p>Email: support@example.com</p>
              <p>Phone: +1-123-456-7890</p>
            </div>
            <div className={SettingStyle.supportOptions}>
              <h4>Support Options</h4>
              <li>Live Chat Support</li>
              <li>Email Support</li>
              <li>Phone Support</li>
            </div>
            <form className={SettingStyle.feedbackForm}>
              <h4>Submit Feedback</h4>
              <textarea placeholder="Enter your feedback"></textarea>
              <button type="submit">Submit Feedback</button>
            </form>
          </div>
        );
    }
  };

  return (
    <div className={SettingStyle.my_setting_container}>
      <div className={SettingStyle.my_profile_box}>
        <img
          className={SettingStyle.__hrImg}
          title="Profile"
          src={
            profileImage ??
            "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
          }
          alt="profile_img"
          onError={(e) => {
            e.target.src =
              "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg";
            e.onError = null;
          }}
        />
        <h4 className={SettingStyle.__pfGreet}> {name}</h4>
      </div>
      <div className={SettingStyle.Setting_opt_container}>
        <div className={SettingStyle.setting_opt_left}>
          <div
            className={
              settingtype === "Setting/Profile"
                ? `${SettingStyle.setting_opt_active} `
                : SettingStyle.setting_opt
            }
            onClick={() => setsettingtype("Setting/Profile")}
          >
            <i className="fa-solid fa-user" /> Profile
          </div>
          <div
            className={
              settingtype === "Setting/privacy"
                ? SettingStyle.setting_opt_active
                : SettingStyle.setting_opt
            }
            onClick={() => setsettingtype("Setting/privacy")}
          >
            <i className="fa-solid fa-lock" /> Privacy & Service
          </div>
          <div
            className={
              settingtype === "Setting/appearance"
                ? SettingStyle.setting_opt_active
                : SettingStyle.setting_opt
            }
            onClick={() => setsettingtype("Setting/appearance")}
          >
            <i className="fa-solid fa-wand-magic-sparkles" /> Appearance
          </div>
          <div
            className={
              settingtype === "Setting/notification"
                ? SettingStyle.setting_opt_active
                : SettingStyle.setting_opt
            }
            onClick={() => setsettingtype("Setting/notification")}
          >
            <i className="fa-solid fa-bell" /> Notification
          </div>
          <div
            className={
              settingtype === "Setting/support"
                ? SettingStyle.setting_opt_active
                : SettingStyle.setting_opt
            }
            onClick={() => setsettingtype("Setting/support")}
          >
            <i className="fa-solid fa-headset" /> Support
          </div>
        </div>
        <div className={SettingStyle.setting_opt_right}>
          {renderSettingContent()}
        </div>
      </div>
      {darkModePopup && (
        <div className={SettingStyle.darkModePopup}>
          <div className={SettingStyle.popupContent}>
            <h3 className="exclude-dark-mode">Dark Mode</h3>
            <p className="exclude-dark-mode">
              Choose how your profile experience looks for this device.
            </p>
            <div>
              <label>
                <input
                  type="checkbox"
                  className={SettingStyle.circularCheckbox}
                  checked={darkMode === "Device settings"}
                  onChange={() => handleDarkModeSelection("Device settings")}
                />
                Device settings
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  className={SettingStyle.circularCheckbox}
                  checked={darkMode === "Always on"}
                  onChange={() => handleDarkModeSelection("Always on")}
                />
                Always on
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  className={SettingStyle.circularCheckbox}
                  checked={darkMode === "Always off"}
                  onChange={() => handleDarkModeSelection("Always off")}
                />
                Always off
              </label>
            </div>
            <p className="exclude-dark-mode">
              If you choose Device settings, this app will use the mode that's
              already selected in this device's settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;
