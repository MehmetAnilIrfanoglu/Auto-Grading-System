export default function () {
    return [
        {
            title: "Dashboard",
            to: "/blog-overview",
            htmlBefore: '<i class="material-icons">edit</i>',
            htmlAfter: "",
        },
        {
            title: "Courses",
            htmlBefore: '<i class="material-icons">table_chart</i>',
            to: "/tables",
        },
        {
            title: "Assignments",
            htmlBefore: '<i class="material-icons">error</i>',
            to: "/errors",
        },
    ]
}
