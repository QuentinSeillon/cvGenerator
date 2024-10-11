import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (logInfos) => {
    console.log('logInfos => ', logInfos);

    const userInfos = {
      id: logInfos.user.id,
      nom: logInfos.user.nom,
      prenom: logInfos.user.prenom
    };

    const token = logInfos.user.token;

    console.log('userInfos => ', userInfos);
    console.log('token => ', token);

    setUser(userInfos);

    localStorage.setItem('user', JSON.stringify(userInfos));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const getUserInfos = () => {
    if (!user) {
      const storeUser = localStorage.getItem('user');
      if (storeUser) {
        setTimeout(() => {
          setUser(JSON.parse(storeUser));
        }, 0);
        return JSON.parse(storeUser);
      }
      return null;
    }
    return user;
  };

  return <UserContext.Provider value={{ login, logout, getUserInfos }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { UserProvider };
