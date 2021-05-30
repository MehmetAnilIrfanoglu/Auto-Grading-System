import React from "react"
import { Redirect } from "react-router-dom"

// Layout Types
import { DefaultLayout } from "./layouts"

// Route Views
import Dashboard from "./views/Dashboard"
import Assignments from "./views/Assignments"
import Courses from "./views/Courses"

export default [
    {
        path: "/",
        exact: true,
        layout: DefaultLayout,
        component: () => <Redirect to="/blog-overview" />,
    },
    {
        path: "/blog-overview",
        layout: DefaultLayout,
        component: Dashboard,
    },
    {
        path: "/errors",
        layout: DefaultLayout,
        component: Assignments,
    },
    {
        path: "/tables",
        layout: DefaultLayout,
        component: Courses,
    },
]
