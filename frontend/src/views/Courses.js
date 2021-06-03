import React, { useEffect, useContext } from "react"
import { UserContext } from "../Context"

const Courses = ({ history }) => {
    const [login, setLogin] = useContext(UserContext)

    useEffect(() => {
        if (login) {
        } else {
            history.push("/")
        }
    }, [login])

    return (
        <div>
            <h3>Courses</h3>
        </div>
    )
}

export default Courses
