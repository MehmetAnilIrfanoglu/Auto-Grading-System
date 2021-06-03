import React, { useEffect, useContext } from "react"
import { UserContext } from "../Context"

const Dashboard = ({ history }) => {
    const [login, setLogin] = useContext(UserContext)

    useEffect(() => {
        if (login) {
        } else {
            history.push("/login")
        }
    }, [login])

    return (
        <div>
            <h3>Welcome to dashboard</h3>
        </div>
    )
}

export default Dashboard
