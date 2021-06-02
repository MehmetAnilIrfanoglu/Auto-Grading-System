import React from "react"

const LoginPage = () => {
    return (
        <div>
            <meta charSet="UTF-8" />
            <title>Login</title>
            <meta name="description" content="Login-Register Template" />
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
                    __html: "\n            body {\n                background-color: #303641;\n                               }\n        ",
                }}
            />
            <div id="container-login">
                <div id="title">
                    <i className="material-icons lock">lock</i> Login
                </div>
                <form action="/dashboard">
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
                            <i className="fas fa-lock" />
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
                    <div className="remember-me">
                        <input type="checkbox" />
                        <span style={{ color: "#ddd" }}>Remember Me</span>
                    </div>
                    <input type="submit" value="Log In" />
                </form>
                <div className="forgot-password">
                    <a href="#">Forgot your password?</a>
                </div>
                <div className="privacy">
                    <a href="#">Privacy Policy</a>
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
