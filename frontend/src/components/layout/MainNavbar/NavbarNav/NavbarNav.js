import React, { useContext } from "react"
import { Nav } from "shards-react"
import { UserContext } from "../../../../Context"

const NavbarNav = () => {
    const [login] = useContext(UserContext)

    return (
        <Nav navbar className="my-auto flex flex-row">
           
        </Nav>
    )
}

export default NavbarNav
