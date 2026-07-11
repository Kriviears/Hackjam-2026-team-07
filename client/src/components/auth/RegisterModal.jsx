import { useState } from 'react';
import { registerUser } from '../../services/api';

// Adds a persona selector so new accounts genuinely reflect who the user
// is (aspiring candidate, current learner, or alumni) instead of every
// account defaulting to the same thing.
function RegisterModal({ roadmapData, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [persona, setPersona] = useState('aspiring_candidate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerUser(name, email, password, { ...roadmapData, persona });
      localStorage.setItem('illuminate_token', result.token);
      onSuccess(result.token);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#141518] border border-white/10 rounded-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#F0EAE2]">Save my plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border border-white/15 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border border-white/15 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border border-white/15 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500"
          />

          <label className="text-xs text-gray-400 mt-1">I am a:</label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="bg-white/5 border border-white/15 rounded-lg px-4 py-2 text-sm text-white"
          >
            <option value="aspiring_candidate">Aspiring Candidate</option>
            <option value="learner">Current Learner</option>
            <option value="alumni">Alumni</option>
          </select>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#C9915A] text-[#2A1B0E] font-medium px-5 py-2.5 rounded-lg text-sm mt-2 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Create account & save'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
