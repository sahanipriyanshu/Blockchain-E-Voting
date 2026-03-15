import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Vote, Calendar, Users, TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5002/api');

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalElections: 0,
    activeElections: 0,
    totalVotes: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [electionsRes, votesRes] = await Promise.all([
        axios.get(`${API_URL}/elections`),
        axios.get(`${API_URL}/votes`),
      ]);
      const elections = electionsRes.data;
      setStats({
        totalElections: elections.length,
        activeElections: elections.filter((e) => e.status === 'active').length,
        totalVotes: votesRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">
          Welcome, {user?.name}!
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Elections</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalElections}</p>
              </div>
              <Vote className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Elections</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.activeElections}</p>
              </div>
              <Calendar className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Your Votes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalVotes}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="glass-card mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/elections" className="btn-primary text-center">
              View Elections
            </Link>
            <Link to="/blockchain" className="btn-secondary text-center">
              View Blockchain
            </Link>
          </div>
        </div>

        {/* User Votes Section */}
        <div className="glass-card">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Your Recent Votes</h2>
          <UserVotesList />
        </div>
      </div>
    </div>
  );
};

const UserVotesList = () => {
  const { user } = useContext(AuthContext);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/votes`);
      setVotes(response.data.slice(0, 5)); // Show only last 5 votes
    } catch (error) {
      console.error('Error fetching votes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (votes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-700 dark:text-gray-300">You haven't cast any votes yet</p>
        <Link to="/elections" className="btn-primary mt-4 inline-block">
          View Elections
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {votes.map((vote) => (
        <div
          key={vote._id}
          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between"
        >
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {vote.electionId?.title || 'Election'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Voted for: <span className="font-semibold text-gray-900 dark:text-gray-100">{vote.candidateName}</span>
            </p>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(vote.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
      <div className="text-center pt-4">
        <Link to="/results" className="text-blue-600 dark:text-blue-400 hover:underline">
          View All Votes →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

