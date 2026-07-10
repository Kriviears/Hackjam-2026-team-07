// Modal that lets a guest turn their generated roadmap into a saved account.
// Appears over the roadmap screen when they click "Save my plan".
import { useState } from 'react';
import { registerUser } from '../../services/api';

function RegisterModal({ roadmapData, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const result = await registerUser(name, email, password, roadmapData);
      // Save the token so a future visit can fetch this saved roadmap
      // without logging in again.
      localStorage.setItem('illuminate_token', result.token);
      onSuccess(result.token); // tells App.jsx registration succeeded
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // Dark backdrop covers the roadmap screen behind the modal
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
