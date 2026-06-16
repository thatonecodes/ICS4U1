import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { FaGoogle, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '@/hooks';

const avatarOptions = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Dora',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Elmo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Gina',
];

export default function SignInView() {
  const { currentUser, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(avatarOptions[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setPhotoURL(avatarOptions[0]);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const credential = await signUpWithEmail(email, password);
        await updateProfile(credential.user, {
          displayName: displayName.trim() || email.split('@')[0],
          photoURL,
        });
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    resetForm();
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-400 text-center mb-8">
          {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50 mb-6"
        >
          <FaGoogle className="text-red-500" /> Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">or use email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Display Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-tmdb-light transition"
                    placeholder="Your username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setPhotoURL(url)}
                      className={`rounded-full overflow-hidden border-2 transition ${
                        photoURL === url ? 'border-tmdb-light' : 'border-transparent hover:border-gray-500'
                      }`}
                    >
                      <img src={url} alt="Avatar option" className="w-10 h-10" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-tmdb-light transition"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-tmdb-light transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-tmdb-light text-white rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isSignUp ? <FaUserPlus /> : <FaSignInAlt />}
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={toggleMode}
            className="text-tmdb-light hover:underline font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
