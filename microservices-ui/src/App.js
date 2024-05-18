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

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/topup" component={TopUp} />
        <Route path="/transaction-history" component={TransactionHistory} />
        <Route path="/user" component={UserInfo} />
        <Route path="/delete-user" component={DeleteUser} />
        <Route path="/edit-password" component={EditPassword} />
        <Route path="/edit-transaction/:id" component={EditTransaction} />
        <Route path="/delete-transaction/:id" component={DeleteTransaction} />
      </Switch>
    </Router>
  </AuthProvider>
);

export default App;