import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Calendar, Users, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://blockchain-e-voting-wddd.onrender.com/api');

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections`);
      setElections(response.data);
    } catch (error) {
      toast.error('Failed to fetch elections');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'ended':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Elections</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <Link
              key={election._id}
              to={`/elections/${election._id}`}
              className="glass-card hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{election.title}</h3>
                <span className={`px-3 py-1 rounded-full text-white text-xs ${getStatusColor(election.status)}`}>
                  {election.status}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{election.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{election.candidates?.length || 0} candidates</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(election.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400">
                <span className="text-sm font-semibold">View Details</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          ))}
        </div>

        {elections.length === 0 && (
          <div className="glass-card text-center py-12">
            <p className="text-gray-700 dark:text-gray-300">No elections available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Elections;

