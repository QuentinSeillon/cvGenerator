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
        <li className="nav-item">
          <Link to={'/all-cv'} className="nav-link">
            All CV
          </Link>
        </li>
        {user && (
          <>
            <li className="nav-item">
              <Link to={'/create-cv'} className="nav-link">
                Create CV
              </Link>
            </li>
            <li className="nav-item">
              <Link to={'/my-cvs'} className="nav-link">
                My CVs
              </Link>
            </li>
          </>
        )}
        <li className="nav-items">
          {user ? (
            <div>
              <span className="nav-link" role="button" onClick={logout}>
                logout
              </span>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <Link to={'/register'} className="nav-link">
                Register
              </Link>
              <Link to={'/login'} className="nav-link">
                Login
              </Link>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Header;
