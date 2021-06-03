import React from "react"
import { Redirect } from "react-router-dom"

// Layout Types
import { DefaultLayout } from "./layouts"
import { LoginLayout } from "./layouts"
// Route Views
import Dashboard from "./views/Dashboard"
import Assignments from "./views/Assignments"
import Courses from "./views/Courses"
import LoginPage from "./views/LoginPage"
import RegisterPage from "./views/RegisterPage"
import Logout from "./views/Logout"

const Routes = [
    {
        path: "/",
        exact: true,
        layout: LoginLayout,
        component: () => <Redirect to="/login" />,
    },
    {
        path: "/login",
        layout: LoginLayout,
        component: LoginPage,
    },
    {
        path: "/logout",
        layout: LoginLayout,
        component: Logout,
    },
    {
        path: "/register",
        layout: LoginLayout,
        component: RegisterPage,
    },
    {
        path: "/dashboard",
        layout: DefaultLayout,
        component: Dashboard,
    },
    {
        path: "/assignments",
        layout: DefaultLayout,
        component: Assignments,
    },
    {
        path: "/courses",
        layout: DefaultLayout,
        component: Courses,
    },
]

export default Routes
