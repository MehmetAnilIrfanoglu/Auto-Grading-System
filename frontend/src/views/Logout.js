import React, { useEffect, useContext } from "react"
import { UserContext } from "../Context"

const Logout = ({ history }) => {
    const [, setLogin] = useContext(UserContext)

    useEffect(() => {
        setLogin(false)
        history.push("/login")
    }, [setLogin, history])

    return <div></div>
}

export default Logout
