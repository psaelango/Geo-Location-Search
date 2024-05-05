import React from 'react';
import { FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../store/auth/authSlice'
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function NavigationBar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {
          user ?
          <Nav className="mr-auto" style={{width: '100%'}}>
            <LinkContainer to="/home">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/location-search">
              <Nav.Link>Search Location</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/nearby-locations">
              <Nav.Link>Near By Locations</Nav.Link>
            </LinkContainer>
            <div style={{marginLeft: 'auto'}}>
              <LinkContainer to="/">
                <Nav.Link onClick={onLogout}>
                  <FaSignOutAlt /> Logout
                </Nav.Link>
              </LinkContainer>
            </div>
          </Nav> :
          <Nav className="mr-auto" style={{marginLeft: 'auto'}}>
            <LinkContainer to="/login">
              <Nav.Link><FaSignInAlt /> Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/register">
              <Nav.Link><FaUser /> Register</Nav.Link>
            </LinkContainer>
          </Nav>
        }
      </Navbar.Collapse>
    </Navbar>
  );
}
export default NavigationBar;