import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import signupStyle from "../Signup.module.css";
import { useDispatch } from "react-redux";
import { handleUserLogin } from "../../../../Redux/ReduxSlice";

const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

const Signup = () => {
  const dispatchTO = useDispatch();
  const [isSubmitting, setIsSubmitting]= useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    conf_password: "",
    showPassword1: false,
    showPassword2: false,
    userType: "employee",
  });

  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleShowPassword = (fieldName) => {
    setFormData({ ...formData, [fieldName]: !formData[fieldName] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    if (formData.password !== formData.conf_password) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { name, email, password, userType } = formData;

      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("email", email);
      formDataToSend.append("password", password);
      formDataToSend.append("userType", userType);

      const response = await axios.post(
        `${baseUrl}/hr/signup`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      // Store user details in local storage
      localStorage.setItem("email", email);
      localStorage.setItem("name", name);
      dispatchTO(
        handleUserLogin({
          email: email,
          name: name,
          userType: "employee",
        })
      );
      toast.success(`Welcome ${name}`);
      setTimeout(() => {
        nav("/");
      }, 1500);
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data);
        toast.error("Internal Server Error");
      } else {
        console.error("Error:", error.message);
        toast.error(error.message);
      }
    }finally{
      setIsSubmitting(false)
    }
  };

  const handleLogin = () => {
    nav("/login");
  };

  return (
    <>
      <div className={signupStyle.signup_container}>
        <div className={signupStyle.step_container}>
          <div className={signupStyle.step_flex_container}>
            <div className={signupStyle.step_1_part_1}>
              <h1
                className={` ${signupStyle.kumar_one_regular} ${signupStyle.step_1_banner_heading_signup}`}
              >
                WELCOME <br />
                BACK
              </h1>
              <div className={signupStyle.create_account_name_container}>
                <h3>Create an Account</h3>
                <div>
                  To keep connected with us please signup <br /> with your
                  personal info
                </div>
              </div>
            </div>
            <div className={signupStyle.step_2_part_2}>
              <h4 style={{ paddingBottom: "10px" }}>Personal Information</h4>
              <div>
                <Form onSubmit={handleSubmit}>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    onChange={handleChange}
                    className={signupStyle.personal_input_field}
                    required
                  />

                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email Id"
                    onChange={handleChange}
                    className={signupStyle.personal_input_field}
                    required
                  />

                  <div className={signupStyle.password_container}>
                    <div>
                      <Form.Control
                        type={formData.showPassword1 ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className={signupStyle.personal_input_field}
                        required
                      />
                    </div>

                    <div>
                      <FontAwesomeIcon
                        icon={formData.showPassword1 ? faEyeSlash : faEye}
                        onClick={() => toggleShowPassword("showPassword1")}
                        style={{ cursor: "pointer" }}
                        className={signupStyle.eye_icon}
                      />
                    </div>
                  </div>

                  <div className={signupStyle.password_container}>
                    <div>
                      <Form.Control
                        type={formData.showPassword2 ? "text" : "password"}
                        name="conf_password"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        className={signupStyle.personal_input_field}
                        required
                      />
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={formData.showPassword2 ? faEyeSlash : faEye}
                        onClick={() => toggleShowPassword("showPassword2")}
                        style={{ cursor: "pointer" }}
                        className={signupStyle.eye_icon}
                      />
                    </div>
                  </div>
                  <div
                    onClick={handleLogin}
                    style={{
                      paddingTop: "10px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Already have employer account?&nbsp;
                    <span style={{ color: "rgba(35, 88, 251, 1)" }}>
                      login here
                    </span>
                  </div>
                  <div className={signupStyle.step_button_container}>
                    <Button className={signupStyle.step_button} type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating Account...": "Create Account"}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
