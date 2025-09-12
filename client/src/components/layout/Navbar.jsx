import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../assets/logo.ico';
import Button from '../common/Button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="AlgoAliens Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">AlgoAliens</span>
        </Link>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-primary hidden sm:block">Welcome, {user?.name}</span>
              <Button onClick={logout} variant="secondary">Logout</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
