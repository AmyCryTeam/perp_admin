import { Button } from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import styles from './Header.module.scss'

export const Header = () => {
    return (
        <>
            <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="/">Perp admin</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="bots">Active bots</Nav.Link>
                        </Nav>
                        <Button variant="outline-success" href="/">Add Bot</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className={styles.HeaderBackdrop} />
        </>
    );
}
