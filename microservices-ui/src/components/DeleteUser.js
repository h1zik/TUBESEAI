import React, { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Container, Button, Title } from '../styles/styles';

const DeleteUser = () => {
  const { auth, logout } = useContext(AuthContext);

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5003/user/${auth.user}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      alert('User deleted successfully');
      logout();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  return (
    <Container>
      <Title>Delete Account</Title>
      <Button onClick={handleDeleteUser}>Delete Account</Button>
    </Container>
  );
};

export default DeleteUser;