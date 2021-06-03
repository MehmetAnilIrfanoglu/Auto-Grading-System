import React, { useState, useContext } from "react"
import { UserContext } from "../Context"

var AutoGradingApi = require("auto_grading_api")

const LoginPage = ({ history }) => {
    const [, setLogin] = useContext(UserContext)

    const [formEmail, setEmail] = useState("")
    const [formPassword, setPassword] = useState("")

    const loginUser = (e) => {
        e.preventDefault()

        let apiInstance = new AutoGradingApi.DefaultApi()
        let username = formEmail
        let password = formPassword
        let opts = {
            grantType: "password",
        }
        apiInstance.loginForAccessTokenTokenPost(
            username,
            password,
            opts,
            (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log(
                        "API called successfully. Returned data: " + data
                    )
                    const token = data.access_token

                    let defaultClient = AutoGradingApi.ApiClient.instance
                    let OAuth2PasswordBearer =
                        defaultClient.authentications["OAuth2PasswordBearer"]
                    OAuth2PasswordBearer.accessToken = data.access_token

                    let apiInstance = new AutoGradingApi.UsersApi()
                    apiInstance.getCurrentUser((error, data, response) => {
                        if (error) {
                            console.error(error)
                        } else {
                            console.log(
                                "API called successfully. Returned data: " +
                                    data
                            )
                            setLogin({
                                userToken: token,
                                userName: data.name,
                                userNumber: data.number,
                                userID: data._id,
                                userGroup: data.user_group,
                            })
                            history.push("/dashboard")
                        }
                    })
                }
            }
        )
    }

    return (
        <div>
            <style
                dangerouslySetInnerHTML={{
                    __html: "\n            body {\n                background-color: #303641;\n                               }\n        ",
                }}
            />
            <div id="container-login">
                <div id="title">
                    <i className="material-icons lock">lock</i> Login
                </div>
                <form onSubmit={loginUser.bind(this)}>
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
                            <i className="fas fa-lock" />
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
                    <div className="remember-me">
                        <input type="checkbox" />
                        <span style={{ color: "#ddd" }}>Remember Me</span>
                    </div>
                    <input type="submit" value="Log In" />
                </form>
                <div className="forgot-password">
                    <a href="/">Forgot your password?</a>
                </div>
                <div className="privacy">
                    <a href="/">Privacy Policy</a>
                </div>
                <div className="register">
                    First time using our grading system?
                    <a href="/register">
                        <button id="register-link">Register here</button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
