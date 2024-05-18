import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Container, Form, FormGroup, Label, Input, Button, Title, Message } from '../styles/styles';

const EditTransaction = ({ transactionId }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const { auth } = useContext(AuthContext);

  const handleTransactionEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5003/transactions/${transactionId}`, {
        amount: parseFloat(amount)
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setMessage('Transaction updated successfully');
    } catch (error) {
      setMessage('Failed to update transaction');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleTransactionEdit}>
        <Title>Edit Transaction</Title>
        {message && <Message error={!message.includes('successfully')}>{message}</Message>}
        <FormGroup>
          <Label>New Amount:</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">Update Transaction</Button>
      </Form>
    </Container>
  );
};

export default EditTransaction;