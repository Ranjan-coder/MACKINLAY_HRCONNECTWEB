import React, { useEffect, useState } from "react";
import SideNavbar from "./components/SideNavBar/SideNavbar";
import { Outlet } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import JobSeekerStyle from "./JobSeeker.module.css";
import { CiSearch } from "react-icons/ci";
import { TiLocation } from "react-icons/ti";
import { IoMicOutline } from "react-icons/io5";
import { IoMicOffOutline } from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";
import { IoIosNotificationsOutline } from "react-icons/io";
import Filter from "./components/FilterBox/Filter";
import { handleSetFilterData, handleRemoveFilterData, handleSearchData, } from "../../Redux/ReduxFilterSlice";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client"
import Badge from '@mui/material/Badge';
import axios from "axios";
import NotificationBox from "../Common-Components/NotificationBox";
const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL
const newUrl = process.env.REACT_APP_BACKEND_BASE_URL_WITHOUT_API
function JobSeekerLayout() {
  const { pathname } = useLocation();
  const navigateTO = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (pathname === "/") {
      navigateTO("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const [ToggleFilter, setToggleFilter] = useState(false);

  const handleFilterOnchange = (e) => {
    if (e.target.checked) {
      dispatch(
        handleSetFilterData({
          name: e.target.name,
          value: e.target.value,
        })
      );
    } else {
      dispatch(
        handleRemoveFilterData({
          name: e.target.name,
          value: e.target.value,
        })
      );
    }
  };

  const handleToogleFilter = (e) => {
    setToggleFilter(!ToggleFilter);
  };

  return (
    <section className={JobSeekerStyle.JobSeeker_Layout_Container}>
      <div className={JobSeekerStyle.LayoutContainer__LeftSideContainer}>
        <SideNavbar />
      </div>
      <div className={JobSeekerStyle.LayoutContainer__RightSideContainer}>
        {pathname === '/Chatarea' || pathname === '/chatbot' ? (
          <ChatbotNavbar />
        ) : (
          <header className={JobSeekerStyle.RightSideContainer__topHeaderContainer}>
            {pathname !== '/interviews' && <DashboardTopComponent CBOnchange={handleFilterOnchange} CbToggle={handleToogleFilter} />}
            {pathname === '/interviews' && <InterviewTopNavbar />}
          </header>
        )}

        <div className={JobSeekerStyle.__OutletContainer}>
          <Outlet />
        </div>
      </div>

      {ToggleFilter && (
        <Filter handleOnChange={handleFilterOnchange} CbToggle={handleToogleFilter} />
      )}
    </section>
  );
}

export default JobSeekerLayout;

// Topnavbar Components
function DashboardTopComponent({ CbToggle }) {
  const socket = io(`${newUrl}`);
  const { email } = useSelector((state) => state.Assessment.currentUser);
  const [notificationCount, setNotificationCount] = useState(0);
  const [ToggleNotification, SetToggleNotification] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searhOption, setSearchOption] = useState({
    searchText: "",
    Location: "",
  });
  const dispatch = useDispatch();

  const recognition = new window.webkitSpeechRecognition(); // Initialize speech recognition

  recognition.continuous = false; // Enable continuous listening
  recognition.lang = "en-US"; // Set the language for speech recognition

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    setSearchOption({ ...searhOption, "searchText": transcript });
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  const toggleMicListening = (e) => {
    e.preventDefault();
    if (isListening) {
      recognition.stop(); // Stop speech recognition if it's currently listening
      setIsListening(false);
    } else {
      recognition.start(); // Start speech recognition
      setIsListening(true);
    }
  };

  // const countries = [
  //   "India",
  //   "Singapore",
  //   "Malaysia",
  //   "Hong Kong",
  //   "South Korea",
  //   "Japan"
  // ]

  const allCities = [
    "India",
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Itanagar",
    "Naharlagun",
    "Pasighat",
    "Namsai",
    "Ziro",
    "Guwahati",
    "Dibrugarh",
    "Silchar",
    "Jorhat",
    "Tinsukia",
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Nalanda",
    "Raipur",
    "Bhilai",
    "Bilaspur",
    "Korba",
    "Durg",
    "Panaji",
    "Margao",
    "Vasco da Gama",
    "Mapusa",
    "Ponda",
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Faridabad",
    "Gurgaon",
    "Panipat",
    "Ambala",
    "Hisar",
    "Shimla",
    "Manali",
    "Dharamshala",
    "Kullu",
    "Mandi",
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Deoghar",
    "Bangalore",
    "Mysore",
    "Hubli",
    "Mangalore",
    "Belgaum",
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Thrissur",
    "Kollam",
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Aurangabad",
    "Imphal",
    "Thoubal",
    "Kakching",
    "Lilong",
    "Ukhrul",
    "Shillong",
    "Tura",
    "Jowai",
    "Nongpoh",
    "Baghmara",
    "Aizawl",
    "Lunglei",
    "Saiha",
    "Champhai",
    "Kolasib",
    "Kohima",
    "Dimapur",
    "Mokokchung",
    "Tuensang",
    "Wokha",
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Brahmapur",
    "Sambalpur",
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Ajmer",
    "Gangtok",
    "Namchi",
    "Gyalshing",
    "Mangan",
    "Singtam",
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Ramagundam",
    "Agartala",
    "Dharmanagar",
    "Udaipur",
    "Belonia",
    "Kailashahar",
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Meerut",
    "Dehradun",
    "Haridwar",
    "Rishikesh",
    "Nainital",
    "Mussoorie",
    "Kolkata",
    "Howrah",
    "Asansol",
    "Siliguri",
    "Durgapur",
    "Port Blair",
    "Car Nicobar",
    "Mayabunder",
    "Bamboo Flat",
    "Garacharma",
    "Chandigarh",
    "Daman",
    "Silvassa",
    "Kavaratti",
    "Agatti",
    "Andrott",
    "Minicoy",
    "New Delhi",
    "Gurgaon",
    "Noida",
    "Faridabad",
    "Ghaziabad",
    "Pondicherry",
    "Karaikal",
    "Mahe",
    "Yanam",

    "Singapore",
    "Kampong Serangoon Kechil",
    "Jalan Kayu",
    "Bukit Sembawang Estate",
    "Choa Chu Kang New Town",
    "Keat Hong Village",
    "Bukit Panjang Estate",
    "Kampong Cutforth",
    "Matilda Estate",
    "Serangoon",
    "Kampong Pinang",
    "Kampong Tongkang Pechah",
    "Kampong Teban",
    "Kampong Sungai Tengah",
    "Kangkar",
    "Kampong Beremban",
    "Seletar Hills Estate",
    "Song Hah Estate",
    "Woodlands New Town",
    "Mok Peng Hiang Estate",
    "Jurong Town",
    "Tay Keng Loon Estate",
    "Bukit Panjang New Town",
    "Marsiling",
    "Kampong Kranji",
    "Chia Keng",
    "Jurong West",
    "Kampong Ulu Jurong",
    "Somapah Serangoon",
    "Boon Lay",
    "Kampong Sireh",
    "Kampong Bukit Panjang",
    "Marsiling Estate",
    "Ong Lee",
    "Kampong Chai Chee",
    "Ulu Bedok",
    "Kampong Pachitan",
    "Bedok New Town",
    "Bedok Ville",
    "Kampong Ladang",
    "Kampong Reteh",
    "Kampong Ubi",
    "Kampong Wak Hassan",
    "Chong Pang",
    "Sembawang",
    "Yio Chu Kang",
    "Yio Chu Kang Estate",
    "Ang Mo Kio New Town",
    "Singapore United Plantation",
    "Kampong Amoy Quee",
    "Kampong Lew Lian",
    "Kampong Kebun Baharu",
    "Saint Michael’s Estate",
    "Kam Wak Hassan",
    "Sungai Simpang",
    "Teacher’s Housing Estate",
    "Tanjong Pagar",
    "Kampong Kopit",
    "Saga",
    "Kampong Siren",
    "Nee Soon Estate",
    "Kampong Pengkalan Kundor",
    "Kampong Punggol",
    "Punggol",
    "Yew Tee",
    "Kampong Sungai Blukar",
    "Kampong Loyang",
    "Springleaf Park",
    "Kampong Tebing Terjun",
    "Kampong Belimbing",
    "West Coast Village",
    "Kampong Sungai Pandan",
    "Yishun New Town",
    "Kampong Pengkalan Petai",
    "Sarang Rimau",

    "Malaysia",
    "Kuala Lumpur",
    "Seberang Jaya",
    "Klang",
    "Ipoh",
    "George Town",
    "Petaling Jaya",
    "Kuantan",
    "Shah Alam",
    "Sungai Petani",
    "Johor Bahru",
    "Kota Bharu",
    "Melaka",
    "Kota Kinabalu",
    "Seremban",
    "Sandakan",
    "Kuching",
    "Kluang",
    "Muar",
    "Pasir Gudang",
    "Kuala Terengganu",
    "Sibu",
    "Taiping",
    "Kajang",
    "Miri",
    "Teluk Intan",
    "Kulai",
    "Alor Setar",
    "Bukit Mertajam",
    "Lahad Datu",
    "Segamat",
    "Tumpat",
    "Keningau",
    "Batu Pahat",
    "Batu Gajah",
    "Tuaran",
    "Bayan Lepas",
    "Port Dickson",
    "Bintulu",
    "Tawau",
    "Simanggang",
    "Labuan",
    "Cukai",
    "Butterworth",
    "Putrajaya",
    "Taman Johor Jaya",
    "Kangar",

    "Hong Kong",
    "Kowloon",
    "Sha Tin",
    "Kowloon City",
    "Sham Shui Po",
    "Tin Shui Wai",
    "Central District",
    "Tsing Yi Town",
    "Lam Tin",
    "San Tung Chung Hang",
    "Kennedy Town",
    "Kwai Chung",
    "Pak Tin Pa",
    "Cheung Chau",

    "South Korea",
    "Seoul",
    "Busan",
    "Incheon",
    "Daegu",
    "Gwangju",
    "Daejeon",
    "Suwon",
    "Ulsan",
    "Tongjin",
    "Goyang",
    "Changwon",
    "Sŏngnam",
    "Bucheon",
    "Anyang",
    "Gwangmyeongni",
    "Kunp’o",
    "Guri",
    "Dongnae",

    "Japan",
    "Tokyo",
    "Ōsaka",
    "Nagoya",
    "Yokohama",
    "Fukuoka",
    "Sapporo",
    "Kawasaki",
    "Kōbe",
    "Kyōto",
    "Saitama",
    "Hiroshima",
    "Sendai",
    "Setagaya",
    "Nerima",
    "Ōta-ku",
    "Edogawa",
    "Adachi",
    "Itabashi",
    "Suginami-ku",
    "Kōtō-ku",
    "Katsushika-ku",
    "Shinagawa-ku",
    "Toyonaka",
    "Kita-ku",
    "Shinjuku",
    "Nakano",
    "Toshima",
    "Meguro",
    "Sumida",
    "Minato",
    "Bunkyō-ku",
    "Chōfugaoka",
    "Shibuya-ku",
    "Arakawa",
    "Taitō",
    "Nishitōkyō",
    "Kamirenjaku",
    "Chūō-ku",
    "Musashino",
    "Moriguchi",
    "Kokubunji",
    "Koganei",
    "Hōyachō",
    "Shibuya",
    "Komae",
    "Tanashichō",
    "Warabi",
  ];

  const handleSearchInputChange = (e) => {
    setSearchOption({ ...searhOption, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const setTextTimeOut = setTimeout(() => {
      if (searhOption.searchText || searhOption.Location) {
        dispatch(handleSearchData(searhOption));
      } else {
        dispatch(handleSearchData(searhOption));
      }
    }, 1000);
    return () => clearTimeout(setTextTimeOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searhOption]);

  // !Load Notifications
  const LoadNotifications = () => {
    axios.get(`${baseUrl}/user/notifications/get-notification/${email}`).then((response) => {
      if (response.data.success) {
        setNotificationCount(response.data.notification.filter((data) => data.notificationStatus.toLowerCase() === 'Unread'.toLowerCase()).length);
      } else {
        setNotificationCount(0);
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  // use Effect for socket only

  useEffect(() => {
    socket.emit("userConnect", JSON.stringify({ userEmail: email }));
    LoadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    socket.on("receiveNotification", (data) => {
      axios.post(`${baseUrl}/user/notifications/save-notification`, JSON.parse(data)).then((response) => {
        if (response.data.success) {
          LoadNotifications()
        }
      }).catch((error) => {
        console.log(error)
      })
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  return (
    <>
      <div className={JobSeekerStyle.Dashboard_TopHeader_Container}>
        <div className={JobSeekerStyle.searchFormContainer}>
          <form className={JobSeekerStyle.DashboardSearchBarBox} onSubmit={(e) => e.preventDefault()}>
            <div className={JobSeekerStyle.SearchInputBox}>
              <div className={JobSeekerStyle.SearchICONBox}>
                <CiSearch className={JobSeekerStyle.SearchICON} />
              </div>
              <input
                type="text"
                name="searchText"
                id="searchText"
                autoComplete="off"
                className={JobSeekerStyle.SearchInput}
                placeholder="Job tittle, keyword, company"
                onChange={handleSearchInputChange}
                value={searhOption.searchText}
              />
            </div>

            <div className={JobSeekerStyle.SearchSelectBox}>
              <div className={JobSeekerStyle.SearchICONBox}>
                <TiLocation className={JobSeekerStyle.SearchICON} />
              </div>
              <select
                name="Location"
                id="Location"
                className={JobSeekerStyle.SearchSelectInput}
                onChange={handleSearchInputChange}
              >
                <option className={JobSeekerStyle.SeachSelectOPTION} value="">
                  Select your location
                </option>

                {allCities.map((city, index) => {
                  return (
                    <option
                      key={index}
                      className={JobSeekerStyle.SeachSelectOPTION}
                      value={city}
                    >
                      {city}
                    </option>
                  );
                })}
              </select>

              {isListening ? (
                <IoMicOutline
                  className={JobSeekerStyle.Search_MICICON}
                  onClick={toggleMicListening}
                />
              ) : (
                <IoMicOffOutline
                  className={JobSeekerStyle.Search_MICICON}
                  onClick={toggleMicListening}
                />
              )}
            </div>
          </form>
        </div>

        <div className={JobSeekerStyle.FilterAndNotificationBox}>
          <VscSettings className={JobSeekerStyle.filterBox_ICON} onClick={CbToggle} />


          <Badge color="primary" badgeContent={notificationCount}>
            <IoIosNotificationsOutline className={JobSeekerStyle.filterBox_ICON} onClick={(e) => SetToggleNotification(!ToggleNotification)} />
          </Badge>
        </div>
      </div>

      {
        ToggleNotification && <NotificationBox notificationCounter={setNotificationCount} CbCloseNotification={SetToggleNotification} />
      }

    </>

  );
}

// InterviewNavbar Component
function InterviewTopNavbar() {
  return (
    <div className={JobSeekerStyle.__interview_Top_Navbar}>
      <span>
        <FontAwesomeIcon className={JobSeekerStyle.robo} icon={faRobot} />
        <span style={{ color: "rgb(0, 255, 51)", paddingLeft: "1.5em", fontSize: "24px", fontWeight: "600" }}>Online</span>
      </span>
      <FontAwesomeIcon className={JobSeekerStyle.sound} icon={faVolumeHigh} />
    </div>
  )
}


function ChatbotNavbar() {
  return (
    <div className={JobSeekerStyle.__chatbotNavbar}>
      {/* to keep this header part , this component should blank */}
    </div>
  )
}
