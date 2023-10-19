// noinspection CheckTagEmptyBody
import { Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useState} from "react";

const TopNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {
        setIsOpen(prevState => !prevState);
    }

    return (
        <Navbar expanded={isOpen} bg="light" expand="lg" collapseOnSelect onClick={handleClick}>
            <Container fluid>
                <Navbar.Brand>Piano Practice</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link as={Link} to="/allEntries">View All Entries</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopNav;