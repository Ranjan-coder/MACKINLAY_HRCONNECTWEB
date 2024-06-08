
import React, { useState } from 'react';
import SettingStyle from '../Settings/Setting.module.css';
import { useNavigate } from 'react-router-dom';
import { FiUsers } from "react-icons/fi";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { FaSync } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import { TbUserExclamation } from "react-icons/tb";

import { useSelector } from 'react-redux'

function Setting() {
    const { name,profileImage } = useSelector((state) => state.Assessment.currentUser);

  const [settingtype, setsettingtype] = useState("");
  // const username = localStorage.getItem("name");
  const navi = useNavigate();

  // Function to render content based on setting type
  const renderSettingContent = () => {
    switch (settingtype) {
      case "Setting/Profile":
        return (
          <div className={SettingStyle.profile_designs}>
            {/* Content for Profile setting */}
            <button className={SettingStyle.add_btn}>+ Add Profile</button>
            <div className={SettingStyle.Profile_cont1}>
              <div className={SettingStyle.me_profile_box}>
                <img
                  src={profileImage}
                  alt="profile_img"
                  onError={(e) => { e.target.src = `https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg`; e.onError = null; }}
                />
                <div className={SettingStyle.my_name_sec}>
                  <h4>{name}</h4>
                  <button onClick={() => { navi('/settings/editprofile') }}>Edit My Profile</button>
                </div>
                <div className={SettingStyle.logout_btn}>
                  <p><FaArrowRightToBracket /></p>
                  <span>Log Out</span>
                </div>
              </div>
              <div className={SettingStyle.manage_account}>
                <hr></hr>
                <p><span><FiUsers />
                </span>Manage Account</p>
              </div>

            </div>
            <div className={SettingStyle.Profile_cont2}>
              <div className={SettingStyle.Profile_cont2_One}>
                <p><FaSync /></p><span>Sync</span>
              </div>
              <div className={SettingStyle.Profile_cont2_One}>
                <p><RiUserSettingsFill /></p><span>Profile Preference</span>
              </div>
              <div className={SettingStyle.Profile_cont2_One}>
                <p><TbUserExclamation /></p><span>Personal Info</span>
              </div>
            </div>
          </div>
        );
      case "Setting/privacy":
        return (
          <div>
            {/* Content for Privacy setting */}
            <h3>Privacy Settings</h3>
            <p>This is where you can manage your privacy preferences.</p>
          </div>
        );
      case "Setting/appearance":
        return (
          <div>
            <button className={SettingStyle.add_btn}>+ Add Profile</button>
            <div className={`${SettingStyle.Appearance} ${SettingStyle.Profile_cont2}`}>

              <div className={SettingStyle.Profile_cont2_One}>
                <span>Dark Mode</span>
              </div>

              <div className={SettingStyle.Profile_cont2_One}>
                <span>Font Size</span>
              </div>

              <div className={SettingStyle.Profile_cont2_One}>
                <span>Any other appearance button</span>
              </div>


            </div>

          </div>
        );

      case "Setting/notification":
        return (
          <div>
            <button className={SettingStyle.add_btn}>+ Add Profile</button>
            <div className={`${SettingStyle.notification} ${SettingStyle.Profile_cont1}`}>

              <div className={SettingStyle.checkboxex}>
                <label for='check'>gsbvcxbv</label>
                <div className={SettingStyle.checkbox1}>
                  <input type='checkbox' id='check' className={SettingStyle.click}></input>
                  <span>Allow Notification</span>
                </div>
              </div>


              <div className={SettingStyle.checkboxex}>
                <label for='check'>gsbvcxbv</label>
                <div className={SettingStyle.checkbox1}>
                  <input type='checkbox' id='check' className={SettingStyle.click}></input>
                  <span>Allow Notification</span>
                </div>
              </div>


              <div className={SettingStyle.checkboxex}>
                <label for='check'>gsbvcxbv</label>
                <div className={SettingStyle.checkbox1}>
                  <input type='checkbox' id='check' className={SettingStyle.click}></input>
                  <span>Allow Notification</span>
                </div>
              </div>

            </div>
          </div>

        );
      case "Setting/reset":
        return (
          <div>

          </div>

        );
      case "Setting/call":
        return (
          <div>

          </div>

        );

      case "Setting/help":
        return (
          <div>

          </div>

        );
      case "Setting/support":
        return (
          <div>

          </div>

        );



      // Add cases for other setting types as needed
      default:
        return (
          <div>
            <p>Select any option from the list</p>
          </div>
        );
    }
  };

  return (
    <div className={SettingStyle.my_setting_container}>
      <div className={SettingStyle.setting_profile_section}>
        <div className={SettingStyle.hello_logout}>
          <h3>Hello,</h3>
          <div className={SettingStyle.logout_main}>
          </div>
        </div>
        <div className={SettingStyle.my_profile_box}>
          <img
            src={profileImage}
            alt="profile_img"
            onError={(e) => { e.target.src = `https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg`; e.onError = null; }}
          />
          <div className={SettingStyle.my_name_section}>
            <h4>{name}</h4>
            <button onClick={() => { navi('/settings/editprofile') }}>Edit My Profile</button>
          </div>
        </div>
        <h2>Settings</h2>
      </div>
      <div className={SettingStyle.Setting_opt_container}>
        <div className={SettingStyle.setting_opt_left}>
          <div
            className={
              settingtype === "Setting/Profile"
                ? `${SettingStyle.setting_opt_active} `
                : `${SettingStyle.setting_opt}`
            }
            onClick={() => setsettingtype("Setting/Profile")}
          >

            <i className="fa-solid fa-user"></i>Profile
          </div>
          <div
            className={
              settingtype === "Setting/privacy"
                ? `${SettingStyle.setting_opt_active}`
                : `${SettingStyle.setting_opt}`
            }
            onClick={() => setsettingtype("Setting/privacy")}
          >
            <i className="fa-solid fa-lock"></i>Privacy Search & Service
          </div>
          <div
            className={
              settingtype === "Setting/appearance"
                ? `${SettingStyle.setting_opt_active}`
                : `${SettingStyle.setting_opt}`
            }
            onClick={() => setsettingtype("Setting/appearance")}
          >
            {" "}
            <i className="fa-solid fa-wand-magic-sparkles"></i>Appearance
          </div>
          <div
            className={
              settingtype === "Setting/notification"
                ? `${SettingStyle.setting_opt_active}`
                : `${SettingStyle.setting_opt}`
            }
            onClick={() => setsettingtype("Setting/notification")}
          >
            <i class="fa-solid fa-table-list"></i>
            Notification
          </div>
          <div
            className={
              settingtype === "Setting/reset"
                ? `${SettingStyle.setting_opt_active}`
                : `${SettingStyle.setting_opt}`
            }
            onClick={() => setsettingtype("Setting/reset")}
          >
            <i className="fa-solid fa-rotate-left"></i>Switch to Candidate
          </div>
          <div
            className={
              settingtype === "Setting/call"
                ? `${SettingStyle.setting_opt_active}`
                : `${SettingStyle.setting_opt}`
            }
            onClick={() => setsettingtype("Setting/call")}
          >
            <i className="fa-solid fa-phone"></i>Call & message
          </div>
          <div
            className={
              settingtype === "Setting/help"
                ? `${SettingStyle.setting_opt_active}`
                : `${SettingStyle.setting_opt}`
            }
            onClick={() => setsettingtype("Setting/help")}
          >
            <i className="fa-solid fa-info"></i>Help
          </div>
          <div
            className={
              settingtype === "Setting/support"
                ? `${SettingStyle.setting_opt_active}`
                : `${SettingStyle.setting_opt}`
            }
            onClick={() => setsettingtype("Setting/support")}
          >
            <i className="fa-solid fa-headset"></i>Support
          </div>


          {/* Add other setting options here */}
        </div>
        <div className={SettingStyle.setting_opt_right}>
          <h2>{settingtype}</h2>
          {/* Render the content based on setting type */}
          {renderSettingContent()}
        </div>
      </div>
    </div>
  );
}

export default Setting;
