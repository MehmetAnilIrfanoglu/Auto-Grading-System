import React from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "shards-react"

import MainNavbar from "../components/layout/MainNavbar/MainNavbar"
import "../main.css"

const LoginLayout = ({ children, noNavbar }) => (
    <Container fluid>
        <Row>
            <Col
                className="main-content p-0"
                lg={{ size: 10, offset: 2 }}
                md={{ size: 9, offset: 3 }}
                sm="12"
                tag="main"
            >
                {!noNavbar && <MainNavbar />}
                {children}
            </Col>
        </Row>
    </Container>
)

LoginLayout.propTypes = {
    /**
     * Whether to display the navbar, or not.
     */
    noNavbar: PropTypes.bool,
    /**
     * Whether to display the footer, or not.
     */
    noFooter: PropTypes.bool,
}

LoginLayout.defaultProps = {
    noNavbar: true,
    noFooter: true,
}

export default LoginLayout
