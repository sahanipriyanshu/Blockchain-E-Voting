import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { Vote, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5002/api');

const ElectionDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElection();
    checkVoteStatus();
  }, [id]);

  const fetchElection = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections/${id}`);
      setElection(response.data);
    } catch (error) {
      toast.error('Failed to fetch election details');
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/votes?election=${id}`);
      setHasVoted(response.data.length > 0);
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    try {
      const candidate = election.candidates.find((c) => c._id === selectedCandidate);
      await axios.post(`${API_URL}/votes`, {
        electionId: id,
        candidateId: candidate._id,
        candidateName: candidate.name,
      });
      toast.success('Vote cast successfully!');
      setHasVoted(true);
      navigate('/elections');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cast vote');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">Election not found</p>
      </div>
    );
  }

  const isActive = election.status === 'active';
  const canVote = isActive && !hasVoted && user?.role !== 'admin';

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card mb-6">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{election.title}</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{election.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Status: <span className="font-semibold">{election.status}</span></span>
            <span>Ends: {new Date(election.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        {hasVoted && (
          <div className="glass-card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300 font-semibold">You have already voted in this election</p>
            </div>
          </div>
        )}

        <div className="glass-card">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Candidates</h2>
          <div className="space-y-4">
            {election.candidates.map((candidate) => (
              <div
                key={candidate._id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCandidate === candidate._id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                } ${!canVote ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => canVote && setSelectedCandidate(candidate._id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{candidate.name}</h3>
                    {candidate.party && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.party}</p>
                    )}
                  </div>
                  {canVote && (
                    <input
                      type="radio"
                      checked={selectedCandidate === candidate._id}
                      onChange={() => setSelectedCandidate(candidate._id)}
                      className="w-5 h-5"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {canVote && (
            <button
              onClick={handleVote}
              disabled={!selectedCandidate}
              className="btn-primary w-full mt-6"
            >
              <Vote className="w-5 h-5 inline mr-2" />
              Cast Vote
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionDetail;

