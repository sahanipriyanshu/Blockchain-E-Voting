import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Vote, Calendar, CheckCircle, Users, Hash, Shield } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://blockchain-e-voting-wddd.onrender.com/api');

const Results = () => {
  const { user } = useContext(AuthContext);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [allVotes, setAllVotes] = useState([]);
  const [allVotesAllElections, setAllVotesAllElections] = useState([]);
  const [showAllVotes, setShowAllVotes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
    fetchUserVotes();
    fetchAllVotesAllElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchResults(selectedElection);
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections`);
      setElections(response.data);
      if (response.data.length > 0) {
        setSelectedElection(response.data[0]._id);
      }
    } catch (error) {
      toast.error('Failed to fetch elections');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/votes`);
      setUserVotes(response.data);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const fetchAllVotesAllElections = async () => {
    try {
      // Fetch all votes without election filter - admins will see all, users see their own
      const response = await axios.get(`${API_URL}/votes`);
      setAllVotesAllElections(response.data);
    } catch (error) {
      console.error('Error fetching all votes:', error);
    }
  };

  const fetchResults = async (electionId) => {
    try {
      const response = await axios.get(`${API_URL}/votes?election=${electionId}`);
      const votes = response.data;
      setAllVotes(votes);
      
      const voteCounts = {};
      votes.forEach((vote) => {
        voteCounts[vote.candidateName] = (voteCounts[vote.candidateName] || 0) + 1;
      });
      const chartData = Object.entries(voteCounts).map(([name, votes]) => ({
        name,
        votes,
      }));
      setResults(chartData);
    } catch (error) {
      toast.error('Failed to fetch results');
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Election Results</h1>
            {user?.role === 'admin' ? (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                ✓ Admin Access - You can see all votes from all users
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You can only see your own votes. Admin access required to view all votes.
              </p>
            )}
          </div>
          <button
            onClick={() => setShowAllVotes(!showAllVotes)}
            className="btn-secondary"
          >
            {showAllVotes ? 'Show by Election' : 'Show All Votes'}
          </button>
        </div>

        {!showAllVotes && (
          <div className="glass-card mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Select Election
            </label>
            <select
              value={selectedElection || ''}
              onChange={(e) => setSelectedElection(e.target.value)}
              className="input-field"
            >
              {elections.map((election) => (
                <option key={election._id} value={election._id}>
                  {election.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* All Votes Across All Elections View */}
        {showAllVotes && (
          <div className="glass-card mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                All Votes from All Elections ({allVotesAllElections.length})
              </h2>
            </div>
            
            {allVotesAllElections.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Election</th>
                      {user?.role === 'admin' && (
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Voter</th>
                      )}
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Candidate</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Anonymous Address</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Transaction Hash</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allVotesAllElections.map((vote, index) => (
                      <tr
                        key={vote._id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {vote.electionId?.title || 'Election'}
                          </span>
                        </td>
                        {user?.role === 'admin' && (
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {vote.userId?.name || 'Unknown'}
                              </span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {vote.userId?.email || ''}
                              </span>
                            </div>
                          </td>
                        )}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{vote.candidateName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all max-w-xs">
                              {vote.anonymousAddress || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all max-w-xs">
                              {vote.transactionHash ? `${vote.transactionHash.substring(0, 16)}...` : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(vote.createdAt).toLocaleString()}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-700 dark:text-gray-300">No votes found</p>
              </div>
            )}
          </div>
        )}

        {results.length > 0 && (
          <div className="glass-card">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vote Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {results.length === 0 && selectedElection && !showAllVotes && (
          <div className="glass-card text-center py-12">
            <p className="text-gray-700 dark:text-gray-300">No votes cast yet</p>
          </div>
        )}

        {/* All Votes Section - Shows all votes from all users for selected election */}
        {!showAllVotes && allVotes.length > 0 && (
          <div className="glass-card mt-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                All Votes ({allVotes.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
                      {user?.role === 'admin' && (
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Voter</th>
                      )}
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Candidate</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Anonymous Address</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Transaction Hash</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                  {allVotes.map((vote, index) => (
                    <tr
                      key={vote._id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                      {user?.role === 'admin' && (
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {vote.userId?.name || 'Unknown'}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {vote.userId?.email || ''}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{vote.candidateName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all max-w-xs">
                            {vote.anonymousAddress || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-purple-500" />
                          <span className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all max-w-xs">
                            {vote.transactionHash ? `${vote.transactionHash.substring(0, 16)}...` : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(vote.createdAt).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Votes Section */}
        <div className="glass-card mt-6">
          <div className="flex items-center space-x-2 mb-6">
            <Vote className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Voting History</h2>
          </div>
          
          {userVotes.length > 0 ? (
            <div className="space-y-4">
              {userVotes.map((vote) => (
                <div
                  key={vote._id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {vote.electionId?.title || 'Election'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span>Voted for: <span className="font-semibold text-gray-900 dark:text-gray-100">{vote.candidateName}</span></span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(vote.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {vote.transactionHash && (
                      <div className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all max-w-xs">
                        {vote.transactionHash.substring(0, 20)}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-700 dark:text-gray-300">You haven't cast any votes yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;

