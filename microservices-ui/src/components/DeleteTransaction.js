import React, { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Button } from '../styles/styles';

const DeleteTransaction = ({ transactionId }) => {
  const { auth } = useContext(AuthContext);

  const handleDeleteTransaction = async () => {
    try {
      await axios.delete(`http://localhost:5003/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      alert('Transaction deleted successfully');
    } catch (error) {
      alert('Failed to delete transaction');
    }
  };

  return <Button onClick={handleDeleteTransaction}>Delete Transaction</Button>;
};

export default DeleteTransaction;