import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import TopUp from './components/TopUp';
import TransactionHistory from './components/TransactionHistory';
import UserInfo from './components/UserInfo';
import DeleteUser from './components/DeleteUser';
import EditPassword from './components/EditPassword';
import EditTransaction from './components/EditTransaction';
import DeleteTransaction from './components/DeleteTransaction';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/topup" component={TopUp} />
        <ProtectedRoute path="/transaction-history" component={TransactionHistory} />
        <ProtectedRoute path="/user" component={UserInfo} />
        <ProtectedRoute path="/delete-user" component={DeleteUser} />
        <ProtectedRoute path="/edit-password" component={EditPassword} />
        <ProtectedRoute path="/edit-transaction/:id" component={EditTransaction} />
        <ProtectedRoute path="/delete-transaction/:id" component={DeleteTransaction} />
      </Switch>
    </Router>
  </AuthProvider>
);

export default App;