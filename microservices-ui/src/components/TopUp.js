import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Container, Form, FormGroup, Label, Input, Button, Title, Message } from '../styles/styles';

const TopUp = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const { auth } = useContext(AuthContext);

  const handleTopUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5003/topup', {
        amount: parseFloat(amount)
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setMessage('Top-up successful');
    } catch (error) {
      setMessage('Top-up failed');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleTopUp}>
        <Title>Top-Up</Title>
        {message && <Message error={!message.includes('successful')}>{message}</Message>}
        <FormGroup>
          <Label>Amount:</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">Top-Up</Button>
      </Form>
    </Container>
  );
};

export default TopUp;