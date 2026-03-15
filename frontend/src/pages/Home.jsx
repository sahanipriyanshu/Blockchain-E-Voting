import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Vote, Shield, Lock, CheckCircle } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Blockchain e-Voting System
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Secure, transparent, and tamper-proof voting powered by blockchain technology
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          )}
          {user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">
                Go to Dashboard
              </Link>
              <Link to="/elections" className="btn-secondary text-lg px-8 py-4">
                View Elections
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Secure</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Cryptographic encryption ensures your vote remains private and secure
            </p>
          </div>
          <div className="glass-card text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Transparent</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Public blockchain ledger allows anyone to verify election integrity
            </p>
          </div>
          <div className="glass-card text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Tamper-Proof</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Immutable records prevent fraud and manipulation
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="glass-card-strong pb-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center flex flex-col items-center h-full">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Register</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">Create your account and verify identity</p>
            </div>
            <div className="text-center flex flex-col items-center h-full">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Vote</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">Cast your encrypted vote securely</p>
            </div>
            <div className="text-center flex flex-col items-center h-full">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Verify</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">Your vote is recorded on blockchain</p>
            </div>
            <div className="text-center flex flex-col items-center h-full">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Results</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">View transparent election results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

