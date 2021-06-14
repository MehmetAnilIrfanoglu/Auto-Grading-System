import React, { useState } from "react"

var AutoGradingApi = require("auto_grading_api")

const RegisterPage = ({ history }) => {
    const [formEmail, setEmail] = useState("")
    const [formPassword, setPassword] = useState("")
    const [formName, setName] = useState("")
    const [formNumber, setNumber] = useState("")
    const [formUserGroup, setUserGroup] = useState("instructor")

    const registerUser = (e) => {
        e.preventDefault()

        let apiInstance = new AutoGradingApi.UsersApi()
        let userModel = new AutoGradingApi.UserModel(
            formEmail,
            formPassword,
            formName,
            formNumber,
            formUserGroup
        )
        apiInstance.createUser(userModel, (error, data, response) => {
            if (error) {
                console.error(error)
            } else {
                console.log("API called successfully. Returned data: " + data)
                history.push({ pathname: "/login" })
            }
        })
    }

    return (
        <div>
            <style
                dangerouslySetInnerHTML={{
                    __html: "\n        body {\n            background-image: url('https://emrearolat.com/wp-content/uploads/2019/06/AGU-10.jpg');  \n   background-size: cover;  \n  width: 1200px; \n height:600px; \n background-position: center center; \n background-repeat: no-repeat; \n margin:auto; \n padding:0; \n  background-color: #303641;\n                               }\n         ",
                }}
            />
            <div id="container-register">
                <div id="title">
                    <i className="material-icons lock">lock</i> Register
                </div>
                <form onSubmit={registerUser.bind(this)}>
                    <div className="input">
                        <div className="input-addon">
                            <i className="fa fa-user" />
                        </div>
                        <input
                            id="fullname"
                            placeholder="Full Name"
                            type="text"
                            required
                            onChange={(e) => setName(e.target.value)}
                            className="validate"
                            autoComplete="off"
                        />
                    </div>
                    <div className="clearfix" />
                    <div className="input">
                        <div className="input-addon">
                            <i className="material-icons">email</i>
                        </div>
                        <input
                            id="email"
                            placeholder="Email"
                            type="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="validate"
                            autoComplete="off"
                        />
                    </div>
                    <div className="clearfix" />
                    <div className="input">
                        <div className="input-addon">
                            <i className="fa fa-address-card" />
                        </div>
                        <input
                            id="schoolid"
                            placeholder="School ID"
                            type="number"
                            required
                            onChange={(e) => setNumber(e.target.value)}
                            className="validate"
                            autoComplete="off"
                        />
                    </div>
                    <div className="clearfix" />
                    <div className="input">
                        <div className="input-addon">
                            <i className="material-icons">vpn_key</i>
                        </div>
                        <input
                            id="password"
                            placeholder="Password"
                            type="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="validate"
                            autoComplete="off"
                        />
                    </div>
                    <div className="clearfix" />
                    <div className="input">
                        <span>I am:</span>
                        <br />
                        <label className="radio">
                            <input
                                name="radio"
                                type="radio"
                                defaultChecked
                                onChange={() => setUserGroup("instructor")}
                            />
                            <span>An instructor</span>
                        </label>
                        <label className="radio">
                            <input
                                name="radio"
                                type="radio"
                                onChange={() => setUserGroup("student")}
                            />
                            <span>A student</span>
                        </label>
                    </div>
                    <div className="remember-me">
                        <input type="checkbox" />
                        <span style={{ color: "#DDD" }}>
                            I accept Terms of Service
                        </span>
                    </div>
                    <input type="submit" value="Register" />
                </form>
                <div className="privacy">
                    <a href="/">Privacy Policy</a>
                </div>
                <div className="register">
                    Do you already have an account?
                    <a href="/login">
                        <button id="register-link">Log In here</button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
