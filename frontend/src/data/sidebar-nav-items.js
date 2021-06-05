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
            title: "Editor",
            htmlBefore: '<i class="material-icons">error</i>',
            to: "/editor",
        },
        {
            title: "Logout",
            htmlBefore: '<i class="material-icons">logout</i>',
            to: "/logout",
        },
    ]
}
