import React from "react"
import { Redirect } from "react-router-dom"

// Layout Types
import { DefaultLayout } from "./layouts"
import { LoginLayout } from "./layouts"
// Route Views
import Dashboard from "./views/Dashboard"
import Editor from "./views/Editor"
import Courses from "./views/Courses"
import LoginPage from "./views/LoginPage"
import RegisterPage from "./views/RegisterPage"
import Logout from "./views/Logout"
import CourseDetail from "./views/CourseDetail"
import AssignmentDetail from "./views/AssignmentDetail"

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
        path: "/editor",
        layout: DefaultLayout,
        component: Editor,
    },
    {
        path: "/assignments/:lid/:aid",
        layout: DefaultLayout,
        component: AssignmentDetail,
    },
    {
        path: "/courses",
        layout: DefaultLayout,
        component: Courses,
    },
    {
        path: "/lectures/:id",
        layout: DefaultLayout,
        component: CourseDetail,
    },
]

export default Routes
