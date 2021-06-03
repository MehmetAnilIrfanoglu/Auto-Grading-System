export default function () {
    return [
        {
            title: "Dashboard",
            to: "/dashboard",
            htmlBefore: '<i class="material-icons">edit</i>',
            htmlAfter: "",
        },
        {
            title: "Courses",
            htmlBefore: '<i class="material-icons">table_chart</i>',
            to: "/courses",
        },
        {
            title: "Assignments",
            htmlBefore: '<i class="material-icons">error</i>',
            to: "/assignments",
        },
        {
            title: "Logout",
            htmlBefore: '<i class="material-icons">logout</i>',
            to: "/logout",
        },
    ]
}
