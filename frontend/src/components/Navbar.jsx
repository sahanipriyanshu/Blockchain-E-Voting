import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Vote, LogOut, User, Shield, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  
  const navLinkClass = (path) => `
    relative text-sm font-medium transition-colors duration-200
    ${isActive(path) 
      ? 'text-blue-600 dark:text-blue-400' 
      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}
  `;

  return (
    <nav className="glass-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-blue-50 dark:bg-zinc-800/50 rounded-xl group-hover:scale-105 transition-transform duration-300">
              <Vote className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xl font-bold gradient-text tracking-tight">e-Voting</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/elections" className={navLinkClass('/elections')}>
                  Elections
                </Link>
                <Link to="/blockchain" className={navLinkClass('/blockchain')}>
                  Blockchain
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={navLinkClass('/admin') + " flex items-center space-x-1"}>
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-6 ml-4 pl-6 border-l border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700">
                    <User className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                      {user.role === 'admin' ? 'Admin' : user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-200 dark:border-zinc-800">
                <Link to="/login" className="btn-secondary py-2 px-5 text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-2 space-y-4 border-t border-slate-200 dark:border-zinc-800">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg ${isActive('/') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-400'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-4 py-2 rounded-lg ${isActive('/dashboard') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-400'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/elections"
                  className={`block px-4 py-2 rounded-lg ${isActive('/elections') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-400'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Elections
                </Link>
                <Link
                  to="/blockchain"
                  className={`block px-4 py-2 rounded-lg ${isActive('/blockchain') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-400'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blockchain
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`block px-4 py-2 rounded-lg ${isActive('/admin') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-400'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="pt-4 mt-2 border-t border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center space-x-2 px-4 mb-4">
                    <User className="w-5 h-5 text-slate-500 dark:text-zinc-400" />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {user.role === 'admin' ? 'Admin' : user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 px-4 pt-2">
                <Link
                  to="/login"
                  className="btn-secondary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



