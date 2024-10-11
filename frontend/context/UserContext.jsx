import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storeUser = localStorage.getItem('user');
    return storeUser ? JSON.parse(storeUser) : null;
  });

  const login = (logInfos) => {
    console.log('logInfos => ', logInfos);

    setUser(logInfos);
    localStorage.setItem('user', JSON.stringify());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getUserInfos = () => {
    if (user) {
      return user;
    } else {
      const storeUser = localStorage.getItem('user');
      if (storeUser) {
        setUser(JSON.parse(storeUser));
        return storeUser;
      }
    }
  };

  return <UserContext.Provider value={{ login, logout, getUserInfos }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { UserProvider };
