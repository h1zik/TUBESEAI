import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Container, Form, FormGroup, Label, Input, Button, Title, Message } from '../styles/styles';

const EditPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { auth } = useContext(AuthContext);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5003/user/${auth.user}`, {
        password
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setMessage('Password updated successfully');
    } catch (error) {
      setMessage('Failed to update password');
    }
  };

  return (
    <Container>
      <Form onSubmit={handlePasswordChange}>
        <Title>Edit Password</Title>
        {message && <Message error={!message.includes('successfully')}>{message}</Message>}
        <FormGroup>
          <Label>New Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">Update Password</Button>
      </Form>
    </Container>
  );
};

export default EditPassword;