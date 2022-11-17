import { Button } from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import styles from './Header.module.scss'
import {useSession} from "next-auth/react";
import {AUTH_STATUSES} from "../../constants/ui";

export const Header = () => {
    const { status } = useSession();
    return (
        <>
            <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="/">Perp admin</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {status === AUTH_STATUSES.AUTHENTICATED && (
                          <Nav className="me-auto">
                              <Nav.Link href="/bots">Active bots</Nav.Link>
                          </Nav>
                        )}
                        {status === AUTH_STATUSES.AUTHENTICATED && (
                          <Button variant="outline-success" href="/">Add Bot</Button>
                        )}
                        {status !== AUTH_STATUSES.AUTHENTICATED && (
                          <Button variant="outline-success" href="/api/auth/signin">Login</Button>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className={styles.HeaderBackdrop} />
        </>
    );
}
