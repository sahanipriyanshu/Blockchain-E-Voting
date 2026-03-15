import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Calendar, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://blockchain-e-voting-wddd.onrender.com/api');

const AdminPanel = () => {
  const [elections, setElections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [{ name: '', party: '' }],
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections`);
      setElections(response.data);
    } catch (error) {
      toast.error('Failed to fetch elections');
    }
  };

  const handleCandidateChange = (index, field, value) => {
    const newCandidates = [...formData.candidates];
    newCandidates[index][field] = value;
    setFormData({ ...formData, candidates: newCandidates });
  };

  const addCandidate = () => {
    setFormData({
      ...formData,
      candidates: [...formData.candidates, { name: '', party: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/elections`, formData);
      toast.success('Election created successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        candidates: [{ name: '', party: '' }],
      });
      fetchElections();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create election');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold gradient-text">Admin Panel</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus className="w-5 h-5 inline mr-2" />
            Create Election
          </button>
        </div>

        {showForm && (
          <div className="glass-card mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Create New Election</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="input-field"
                  rows="3"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Candidates</label>
                {formData.candidates.map((candidate, index) => (
                  <div key={index} className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Candidate Name"
                      value={candidate.name}
                      onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Party (optional)"
                      value={candidate.party}
                      onChange={(e) => handleCandidateChange(index, 'party', e.target.value)}
                      className="input-field"
                    />
                  </div>
                ))}
                <button type="button" onClick={addCandidate} className="btn-secondary">
                  Add Candidate
                </button>
              </div>
              <button type="submit" className="btn-primary w-full">
                Create Election
              </button>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <div key={election._id} className="glass-card">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{election.title}</h3>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

