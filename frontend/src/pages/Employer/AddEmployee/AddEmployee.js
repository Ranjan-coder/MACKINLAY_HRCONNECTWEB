import React from 'react'
import AddEmp from './Employee.module.css'
// import { TbCameraPlus } from "react-icons/tb";
import upload from '../../../Assets/upload.png';

function EmployeeAdd() {
    return (
        <div className={AddEmp.Employee_main}>
            <p className={AddEmp.upper_text}>Add a New Staff</p>
            <form className={AddEmp.__main_Container} onSubmit={(e) => e.preventDefault()}>
                <div className={AddEmp.container1}>

                    <div className={AddEmp.__imageContainer}>
                        <img className={AddEmp.__uploadPhoto} src={upload} alt="" />
                        <input type="file" accept='image/*' />
                    </div>

                    <div className={AddEmp.detail}>
                        <p className={AddEmp.txt}>Allowed format</p>
                        <p className={AddEmp.txts}>JPG,JPEG,and PNG</p>
                        <br></br>
                        <p className={AddEmp.txt}>Max file size</p>
                        <p className={AddEmp.txts}>2MB</p>
                    </div>
                </div>

                <div className={AddEmp.container2}>
                    <label for='name'>First name</label>
                    <input type='text' id='name' placeholder='Enter first name' className={AddEmp.input}></input>
                    <label for='email'>Email address</label>
                    <input type='text' id='name' placeholder='Enter email address' className={AddEmp.input}></input>
                    <label for='gender'>Gender</label>
                    <select id='gender' className={AddEmp.gender}>
                        <option value="" disabled selected >Select gender</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                        <option value="other">other</option>
                    </select>
                    <label for='role'>Role</label>
                    <select id='role' className={AddEmp.gender}>
                        <option value="" disabled selected >Select role</option>
                        <option value="1">role1</option>
                        <option value="2">role2</option>
                        <option value="3">role3</option>
                    </select>
                    <label for='staff'>Staff ID</label>
                    <input type='text' id='staff' placeholder='Staff ID' className={AddEmp.input}></input>
                </div>

                <div className={AddEmp.container3}>
                    <label for='name'>Last name</label>
                    <input type='text' id='name' placeholder='Enter last name' className={AddEmp.input}></input>
                    <label for='number'>Phone number</label>
                    <input type='number' id='number' placeholder='Enter phone number' className={AddEmp.input}></input>
                    <label for='number'>Phone number</label>
                    <input type='number' id='number' placeholder='Enter phone number' className={AddEmp.input}></input>
                    <label for='dsignation'>Designation</label>
                    <select id='designation' className={AddEmp.gender}>
                        <option value="" disabled selected >Select designation</option>
                        <option value="1">role1</option>
                        <option value="2">role2</option>
                        <option value="3">role3</option>
                    </select>
                    <label for='mail'>Official email</label>
                    <input type='text' id='mail' placeholder='Official Email' className={AddEmp.input}></input>
                </div>
            </form>
            <button className={AddEmp.__addButton}>Add Staff</button>
        </div>
    )
}

export default EmployeeAdd