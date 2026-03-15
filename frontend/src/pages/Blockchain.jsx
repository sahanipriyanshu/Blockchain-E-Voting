import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Link2, CheckCircle, XCircle, Vote, Clock, Hash, Shield } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5002/api');

const Blockchain = () => {
  const [blockchain, setBlockchain] = useState(null);
  const [blockchainVotes, setBlockchainVotes] = useState(null);
  const [activeTab, setActiveTab] = useState('blocks'); // 'blocks' or 'votes'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockchain();
    fetchBlockchainVotes();
  }, []);

  const fetchBlockchain = async () => {
    try {
      const response = await axios.get(`${API_URL}/blockchain`);
      setBlockchain(response.data);
    } catch (error) {
      toast.error('Failed to fetch blockchain data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockchainVotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/blockchain/votes`);
      setBlockchainVotes(response.data);
    } catch (error) {
      console.error('Failed to fetch blockchain votes:', error);
    }
  };

  const mineBlock = async () => {
    try {
      await axios.post(`${API_URL}/blockchain/mine`);
      toast.success('Block mined successfully!');
      fetchBlockchain();
      fetchBlockchainVotes();
    } catch (error) {
      toast.error('Failed to mine block');
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
          <h1 className="text-4xl font-bold gradient-text">Blockchain Explorer</h1>
          <button onClick={mineBlock} className="btn-primary">
            Mine Block
          </button>
        </div>

        <div className="glass-card mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chain Length</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{blockchain?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chain Valid</p>
              <div className="flex items-center space-x-2">
                {blockchain?.isValid ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {blockchain?.isValid ? 'Valid' : 'Invalid'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {blockchainVotes?.totalVotes || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Votes</p>
              <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">
                {blockchainVotes?.pendingCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'blocks'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'glass-card text-gray-700 dark:text-gray-300 hover:bg-white/20'
            }`}
          >
            Blocks
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'votes'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'glass-card text-gray-700 dark:text-gray-300 hover:bg-white/20'
            }`}
          >
            All Votes ({blockchainVotes?.totalVotes || 0})
          </button>
        </div>

        {/* Blocks View */}
        {activeTab === 'blocks' && (
          <div className="space-y-4">
            {blockchain?.chain?.map((block, index) => (
              <div key={index} className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Block #{index}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(block.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hash</p>
                    <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">{block.hash}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Previous Hash</p>
                    <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">{block.previousHash}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Votes in Block</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {block.data?.votes?.length || 0} vote(s)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Votes View */}
        {activeTab === 'votes' && (
          <div className="space-y-4">
            {/* Pending Votes */}
            {blockchainVotes?.pendingVotes && blockchainVotes.pendingVotes.length > 0 && (
              <div className="glass-card border-2 border-orange-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Pending Votes ({blockchainVotes.pendingVotes.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {blockchainVotes.pendingVotes.map((vote, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Transaction Hash</p>
                          <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">
                            {vote.transactionHash || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Anonymous Address</p>
                          <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">
                            {vote.anonymousAddress || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Election ID</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {vote.electionId || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-600 dark:text-orange-400">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mined Votes */}
            <div className="glass-card">
              <div className="flex items-center gap-2 mb-4">
                <Vote className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Mined Votes ({blockchainVotes?.votes?.length || 0})
                </h2>
              </div>
              {!blockchainVotes?.votes || blockchainVotes.votes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">No votes have been mined yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Cast a vote and mine a block to see votes on the blockchain
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blockchainVotes.votes.map((vote, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-colors"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Hash className="w-4 h-4 text-blue-500" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">Transaction Hash</p>
                          </div>
                          <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">
                            {vote.transactionHash || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">Anonymous Address</p>
                          </div>
                          <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">
                            {vote.anonymousAddress || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Election ID</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {vote.electionId || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-600 dark:text-green-400">
                            Mined
                          </span>
                        </div>
                        {vote.digitalSignature && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Digital Signature</p>
                            <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">
                              {vote.digitalSignature.substring(0, 64)}...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blockchain;

