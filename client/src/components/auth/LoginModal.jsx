import { useState } from 'react';
import { loginUser, getRoadmap } from '../../services/api';

// Login form for returning learners/alumni. Authenticates an existing user
// and loads their saved roadmap — an alternative entry point to the guest
// chat onboarding flow.
function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loginResult = await loginUser(email, password);
      // Persist the token the same way RegisterModal does, so authenticated
      // actions (e.g. toggle-skill) can read it back later.
      localStorage.setItem('illuminate_token', loginResult.token);
      // On success, fetch the saved roadmap with the returned token, then
      // pass it (and the token) to onSuccess so the parent can render the
      // roadmap screen and keep the token in state.
      const roadmap = await getRoadmap(loginResult.userId, loginResult.token);
      onSuccess(roadmap, loginResult.token);
    } catch (err) {
      console.error(err);
      setError('Login failed. Check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#141518] border border-white/10 rounded-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#F0EAE2]">Log in</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
