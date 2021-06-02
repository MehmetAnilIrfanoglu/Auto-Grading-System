import React from "react"

const RegisterPage = () => {
    return (
        <div>
            <meta charSet="UTF-8" />
            <title>Register</title>
            <meta name="description" content="Login-Register Pages" />
            <meta name="author" content="Ahmed Tariq" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <link rel="stylesheet" href="main.css" />
            <link
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet"
            />
            <style
                dangerouslySetInnerHTML={{
                    __html: "\n        body {\n            background-color: #303641;\n        }\n    ",
                }}
            />
            <div id="container-register">
                <div id="title">
                    <i className="material-icons lock">lock</i> Register
                </div>
                <form action="/login">
                    <div className="input">
                        <div className="input-addon">
                            <i className="fa fa-user" />
                        </div>
                        <input
                            id="fullname"
                            placeholder="Full Name"
                            type="text"
                            required
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
                            className="validate"
                            autoComplete="off"
                        />
                    </div>
                    <div className="clearfix" />
                    <div className="input">
                        <span>I am:</span>
                        <br />
                        <label className="radio">
                            <input name="radio" type="radio" defaultChecked />
                            <span>An instructor</span>
                        </label>
                        <label className="radio">
                            <input name="radio" type="radio" />
                            <span>A student</span>
                        </label>
                    </div>
                    <div className="remember-me">
                        <input type="checkbox" />
                        <span style={{ color: "#DDD" }}>
                            I accept Terms of Service
                        </span>
                    </div>
                    <a href="/login">
                        <input type="submit" value="Register" />
                    </a>
                </form>
                <div className="privacy">
                    <a href="#">Privacy Policy</a>
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
