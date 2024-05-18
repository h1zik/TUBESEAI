import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Container, Title, Message } from '../styles/styles';

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5003/user/${auth.user}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };
    fetchUser();
  }, [auth]);

  return (
    <Container>
      <Title>User Information</Title>
      {user ? (
        <div>
          <p>User ID: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Balance: {user.account_balance}</p>
        </div>
      ) : (
        <Message>Loading...</Message>
      )}
    </Container>
  );
};

export default UserInfo;