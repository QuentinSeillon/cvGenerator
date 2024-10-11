import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Header() {
  const { getUserInfos, logout } = useContext(UserContext);
  const user = getUserInfos();

  return (
    <div>
      <ul className="nav">
        <li className="nav-item">
          <Link to={'/'} className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-items">
          {user ? (
            <div>
              <span className="nav-link" role="button" onClick={logout}>
                logout
              </span>
            </div>
          ) : (
            <Link to={'/login'} className="nav-link">
              Login
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Header;
