import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  const login = (token, user) => {
    setAuth({ token, user });
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', user);
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;