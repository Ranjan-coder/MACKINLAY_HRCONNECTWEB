import React, { useEffect, useState } from "react";
import layout from "./RecruiterLayout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { VscSettings } from "react-icons/vsc";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
import NotificationBox from "../../Common-Components/NotificationBox";
import axios from "axios";
const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
const newUrl = process.env.REACT_APP_BACKEND_BASE_URL_WITHOUT_API;
export default function TopBar() {
  const socket = io(`${newUrl}`);
  const { email } = useSelector((state) => state.Assessment.currentUser);
  const [notificationCount, setNotificationCount] = useState(0);
  const [ToggleNotification, SetToggleNotification] = useState(false);
  const navigateTo = useNavigate();


  // !Load Notifications
  const LoadNotifications = () => {
    axios
      .get(`${baseUrl}/user/notifications/get-notification/${email}`)
      .then((response) => {
        if (response.data.success) {
          setNotificationCount(
            response.data.notification.filter(
              (data) =>
                data.notificationStatus.toLowerCase() === "Unread".toLowerCase()
            ).length
          );
        } else {
          setNotificationCount(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    socket.emit("userConnect", JSON.stringify({ userEmail: email }));
    LoadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("receiveNotification", (data) => {
      axios
        .post(
          `${baseUrl}/user/notifications/save-notification`,
          JSON.parse(data)
        )
        .then((response) => {
          if (response.data.success) {
            LoadNotifications();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleSearchCandidate = () =>{
    navigateTo("/search-candidates")
  }

  return (
    <>
      <div className={layout.__topbar}>
        <div className={layout.__searchbar}>
          <FontAwesomeIcon
            className={layout.__topbar_Icon}
            icon={faMagnifyingGlass}
            onClick={handleSearchCandidate}
          />
          <input
            className={layout.__input}
            type="text"
            name="searchText"
            id="searchText"
            placeholder="Search Candidates Online..."
            readOnly
            onClick={handleSearchCandidate}
            style={{cursor:"pointer"}}
          />
        </div>
        <button
          onClick={() => navigateTo("/addemployee")}
          className={layout.__btn_Add_Employee}
        >
          <FontAwesomeIcon icon={faUserPlus} /> Add Employee
        </button>
        <VscSettings
          className={layout.__btn_filter}
          style={{ color: "white", fontSize: "25" }}
        />
        <Badge color="primary" badgeContent={notificationCount}>
          <IoIosNotificationsOutline
            className={layout.__btn_notfication}
            style={{ color: "white", fontSize: "25" }}
            onClick={() => SetToggleNotification(!ToggleNotification)}
          />
        </Badge>
      </div>
      {ToggleNotification && (
        <NotificationBox
          notificationCounter={setNotificationCount}
          CbCloseNotification={SetToggleNotification}
        />
      )}
    </>
  );
}
