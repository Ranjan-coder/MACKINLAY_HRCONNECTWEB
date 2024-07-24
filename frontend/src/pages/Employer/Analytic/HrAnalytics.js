import React,{useEffect, useState} from "react";
import mailICON from "../../../Assets/mailICON.jpg";
import clockICON from "../../../Assets/clockICON.jpg";
// import activeICON from "../../../Assets/ActiveICON.jpg";  // Don't remove this block code
// import callICON from "../../../Assets/callICON.png";   // Don't remove this block of code
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Brush,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import userAnalyticsStyle from "../../Job_Seeker/Analytics/Analytics.module.css";
import { NavLink, useLocation, useNavigate} from "react-router-dom";
import hrAnalyticStyle from './HrAnalytics.module.css'
import axios from "axios";

const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL

const dummyData = [
  {
    name: "Mon",
    value: 446,
  },
  {
    name: "Tue",
    value: 285,
  },
  {
    name: "Wed",
    value: 382,
  },
  {
    name: "Thu",
    value: 368,
  },
  {
    name: "Fri",
    value: 413,
  },
  {
    name: "Sat",
    value: 307,
  },
  {
    name: "Sun",
    value: 432,
  },
];


const HRAnalytic = () => {
  const { pathname } = useLocation();
  const navigateTO = useNavigate();
  useEffect(() => {
    if (pathname === "/analytics") {
      navigateTO("/analytics/weekly");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const period = pathname.split('/')[2];

  return (
    <>
        <div className={hrAnalyticStyle.hr_analytic_container}>
        <AnalyticsPageNavbar/>
        <HRAnalyticsPageCarousel period={period}/>
        <HiringLineChart/>
        <EmailSentBarGraph data={dummyData} />
        <PieArcLabel/>
      </div>
    </>
  );
};

export default HRAnalytic;

function AnalyticsPageNavbar() {
  return (
    <nav className={userAnalyticsStyle.analyticsPage__navbar}>
      <NavLink
        to={"/analytics/weekly"}
        className={({ isActive }) =>
          isActive ? `${userAnalyticsStyle.active} keep-text-black`
            : `${userAnalyticsStyle.analyticsPage__navLInks} keep-text-black`
        } >
        Weekly
      </NavLink>
      <NavLink
        to={"/analytics/monthly"}
        className={({ isActive }) =>
          isActive
            ? `${userAnalyticsStyle.active} keep-text-black`
            : `${userAnalyticsStyle.analyticsPage__navLInks} keep-text-black`
        } >
        Monthly
      </NavLink>
      <NavLink
        to={"/analytics/yearly"}
        className={({ isActive }) =>
          isActive
            ? `${userAnalyticsStyle.active} keep-text-black`
            : `${userAnalyticsStyle.analyticsPage__navLInks} keep-text-black`
        }>
        Yearly
      </NavLink>
    </nav>
  );
}

function HRAnalyticsPageCarousel({period}) {
  const [email, setEmail] = useState(null);
  const [timeSpent, setTimeSpent] = useState(null);

  
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const storedEmail = localStorage.getItem("email");
        setEmail(storedEmail);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (email) {
          let timeSpentResponse;
          if (period === 'weekly') {
            timeSpentResponse = await axios.get(`${baseUrl}/hr/analytics/time-spent/weekly?email=${email}`);
          } else if (period === 'monthly') {
            timeSpentResponse = await axios.get(`${baseUrl}/hr/analytics/time-spent/monthly?email=${email}`);
          } else if (period === 'yearly') {
            timeSpentResponse = await axios.get(`${baseUrl}/hr/analytics/time-spent/yearly?email=${email}`);
          }
          setTimeSpent(timeSpentResponse.data.timeSpent);

        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, [period, email]);


  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const Carousel_Card = [
    {
      cardID: 1,
      cardICON: mailICON,
      cardTitle: "Contacted by mail",
      cardData: "13 Mail",
      cardBG: "#ffffff",
    },
    // {
    //   cardID: 2,
    //   cardICON: callICON,
    //   cardTitle: "Contacted by call",
    //   cardData: "5 calls",
    //   cardBG: "#ffffff",
    // },                                           // Don't remove this block of code
    {
      cardID: 3,
      cardICON: clockICON,
      cardTitle: "Time Spent",
      cardData: `${timeSpent} Min`,
      cardBG: "#ffffff",
    },
    // {
    //   cardID: 4,
    //   cardICON: activeICON,
    //   cardTitle: "Active users",
    //   cardData: "5000",
    //   cardBG: "#ffffff",
    // },                                       // Don't remove this block of code
  ];

  return (
    <Carousel
      swipeable={true}
      draggable={true}
      showDots={false}
      responsive={responsive}
      infinite={false}
      keyBoardControl={true}
      customTransition="all .3"
      transitionDuration={3000}
      containerClass="{carousel-container AnalyticsPageCarousel_container}"
      removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
    >
      {Carousel_Card.map((data) => {
        return (
          <div
            key={data.cardID}
            className={hrAnalyticStyle.AnalyticsPageCarousel_Card}
            style={{ backgroundColor: `${data.cardBG}` }}
          >
            <div className={`${hrAnalyticStyle.AnalyticsPageCarousel_CardTitle} keep-text-black`}>
              <img
                src={data.cardICON}
                alt=""
                className={hrAnalyticStyle.AnalyticsPageCarousel_CardICON}
              />{" "}
              {data?.cardTitle}
            </div>
            <p className={`${hrAnalyticStyle.AnalyticsPageCarousel_CardData} keep-text-black`}>
              <strong>{data.cardData}</strong>
            </p>
          </div>
        );
      })}
    </Carousel>
  );
}

const Hiringdata = [
  {
    name: "January",
    uv: 50,
    pv: 90,
  },
  {
    name: "February",
    uv: 100,
    pv: 120,
  },
  {
    name: "March",
    uv: 150,
    pv: 100,
  },
  {
    name: "April",
    uv: 200,
    pv: 180,
  },
  {
    name: "May",
    uv: 250,
    pv: 205,
  },
  {
    name: "June",
    uv: 300,
    pv: 190,
  },
  {
    name: "July",
    uv: 350,
    pv: 250,
  }
];

const HiringLineChart = () => {
  return(
    <div className={hrAnalyticStyle.hr_bar_container}>
        <div style={{ paddingBottom: '10px' }}><strong>Hiring in past few months</strong></div>
      <LineChart
        width={500}
        height={200}
        data={Hiringdata}
        syncId="anyId"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
      </LineChart>
    </div>
  )
}

 const EmailSentBarGraph = ({ data }) => {
  return (
    <>
       <div className={hrAnalyticStyle.hr_bar_container}>
        <div style={{fontSize:'25px', fontWeight:'500'}}>Mail Sent</div>
        <div><span style={{color:'lightgreen'}}>+1.43%</span> &nbsp; March 25 - March 31</div>
       <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" axisLine={false} tick={{ dy: 10 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" barSize={40} shape={<RoundedRectangle />}/>
      </BarChart>
    </ResponsiveContainer>
       </div>
    </>
  );
};

const RoundedRectangle = (props) => {
  const { x, y, width, height } = props;

  // Define border radius
  const borderRadius = 10;

  return (
    <path
      d={`M${x},${y + borderRadius} 
          A${borderRadius},${borderRadius} 0 0 1 ${x + borderRadius},${y} 
          L${x + width - borderRadius},${y} 
          A${borderRadius},${borderRadius} 0 0 1 ${x + width},${y + borderRadius} 
          L${x + width},${y + height - borderRadius} 
          A${borderRadius},${borderRadius} 0 0 1 ${x + width - borderRadius},${y + height} 
          L${x + borderRadius},${y + height} 
          A${borderRadius},${borderRadius} 0 0 1 ${x},${y + height - borderRadius} 
          Z`}
      fill={props.fill}
    />
  );
};


function PieArcLabel() {
  const data = [
    { value: 35, label: "Women" },
    { value: 65, label: "Men" },
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const formattedData = data.map((item) => ({
    ...item,
    percentage: `${((item.value / total) * 100)
      .toFixed(2)
      .replace(".00", "")}%`,
  }));

  const size = {
    width: 450,
    height: 450,
  };

  return (
    <div className={hrAnalyticStyle.pie_chart_container}>
      <div style={{ fontSize: "20px", fontWeight: "700" }}>
        Statistic By Gender
      </div>
      <PieChart
        series={[
          {
            arcLabel: (item) => `${item.label} (${item.percentage})`,
            arcLabelMinAngle: 45,
            data: formattedData,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
          },
        }}
        {...size}
      />
    </div>
  );
}

