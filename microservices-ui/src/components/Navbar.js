import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #343a40;
  padding: 10px;
`;

const NavLink = styled(Link)`
  color: white;
  margin: 0 10px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <Nav>
      <NavLink to="/topup">Banking System</NavLink>
      {auth.token ? (
        <>
          <NavLink to="/topup">Top-Up</NavLink>
          <NavLink to="/user">User Info</NavLink>
          <NavLink to="/edit-password">Edit Password</NavLink>
          <NavLink to="/delete-user">Delete Account</NavLink>
          <NavLink to="/transaction-history">Transaction History</NavLink>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <NavLink to="/login">Login</NavLink>
      )}
    </Nav>
  );
};

export default Navbar;