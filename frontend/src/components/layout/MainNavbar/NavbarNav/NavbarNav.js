import React, { useContext } from "react"
import { Nav } from "shards-react"
import { UserContext } from "../../../../Context"

const NavbarNav = () => {
    const [login] = useContext(UserContext)

    return (
        <Nav navbar className="my-auto flex flex-row">
            <div className="mx-4">{login && login.userGroup.toUpperCase()}</div>
            <div className="mx-4">{login && login.userName}</div>
            <div className="mx-4">{login && login.userNumber}</div>
        </Nav>
    )
}

export default NavbarNav
