import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaSave, FaUndo, FaSignOutAlt, FaUser, FaLock, FaReceipt, FaTrash } from 'react-icons/fa';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { useAuth, useUserContext } from '@/hooks';
import { formatPrice } from '@/utils/price';
import Dialog from '@/components/site/Dialog';
import { deleteUserData } from '@/services/firestore';

const movieGenres = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 9648, name: 'Mystery' },
  { id: 878, name: 'Sci-Fi' },
];

const tvGenres = [
  { id: 10759, name: 'Action' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' }, { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' }, { id: 10762, name: 'Kids' }, { id: 9648, name: 'Mystery' },
  { id: 10765, name: 'Sci-Fi' },
];

const avatarOptions = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Dora',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Elmo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Gina',
];

export default function SettingsView() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const {
    genrePreferences,
    setGenrePreferences,
    saveGenrePreferences,
    purchases,
  } = useUserContext();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || avatarOptions[0]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [prefs, setPrefs] = useState(genrePreferences);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setPrefs(genrePreferences);
  }, [genrePreferences]);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || avatarOptions[0]);
    }
  }, [currentUser]);

  const isEmailUser = currentUser?.providerData[0]?.providerId === 'password';

  const toggleGenre = (media: 'movie' | 'tv', id: number) => {
    setPrefs((prev) => {
      const current = prev[media];
      const updated = current.includes(id)
        ? current.filter((g) => g !== id)
        : [...current, id];
      return { ...prev, [media]: updated };
    });
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await updateProfile(currentUser, {
        displayName: displayName.trim() || currentUser.displayName,
        photoURL,
      });
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentUser || !isEmailUser) return;
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(currentUser, newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrefs = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      setGenrePreferences(prefs);
      await saveGenrePreferences(prefs);
      setMessage('Genre preferences saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDisplayName(currentUser?.displayName || '');
    setPhotoURL(currentUser?.photoURL || avatarOptions[0]);
    setNewPassword('');
    setConfirmPassword('');
    const resetPrefs = { movie: [], tv: [] };
    setPrefs(resetPrefs);
    setGenrePreferences(resetPrefs);
    saveGenrePreferences(resetPrefs).catch(() => {});
    setMessage('');
    setError('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    setDeleting(true);
    setError('');
    setMessage('');

    try {
      await deleteUserData(currentUser.uid);
      await deleteUser(currentUser);
      navigate('/');
    } catch (err) {
      setDeleting(false);
      setShowDeleteDialog(false);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete account. You may need to sign in again before deleting.'
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FaCog className="text-tmdb-light" /> Settings
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm font-medium"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>

      {(message || error) && (
        <div
          className={`p-3 rounded-lg text-sm ${
            error
              ? 'bg-red-500/20 text-red-400'
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          <p>{error || message}</p>
          {error && error.toLowerCase().includes('permission') && (
            <p className="text-xs mt-1">
              Firestore security rules may be blocking this action. Please ask the project owner to allow authenticated users to read/write their own user document.
            </p>
          )}
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        <div className="bg-gray-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <FaUser /> Profile
            </h2>
            <p className="text-gray-400 text-sm">Update your display name and avatar</p>
          </div>

          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Display Name</label>
            <input
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tmdb-light transition"
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              type="text"
              value={displayName}
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Avatar</label>
            <div className="flex flex-wrap gap-3">
              {avatarOptions.map((url) => (
                <button
                  key={url}
                  onClick={() => setPhotoURL(url)}
                  className={`rounded-full overflow-hidden border-2 transition ${
                    photoURL === url ? 'border-tmdb-light' : 'border-transparent hover:border-gray-500'
                  }`}
                >
                  <img src={url} alt="Avatar option" className="w-12 h-12" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-tmdb-light text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium disabled:opacity-50"
          >
            <FaSave /> Save Profile
          </button>
        </div>

        {isEmailUser && (
          <div className="bg-gray-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <FaLock /> Password
              </h2>
              <p className="text-gray-400 text-sm">Change your password</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tmdb-light transition"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tmdb-light transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              onClick={handleSavePassword}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-tmdb-light text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium disabled:opacity-50"
            >
              <FaSave /> Update Password
            </button>
          </div>
        )}

        <div className="bg-gray-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-lg">Genre Preferences</h2>
            <p className="text-gray-400 text-sm">Select your favorite genres for recommendations</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Movies</h3>
            <div className="flex flex-wrap gap-2">
              {movieGenres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre('movie', genre.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    prefs.movie.includes(genre.id)
                      ? 'bg-tmdb-light text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">TV</h3>
            <div className="flex flex-wrap gap-2">
              {tvGenres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre('tv', genre.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    prefs.tv.includes(genre.id)
                      ? 'bg-tmdb-green text-gray-900'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <FaReceipt /> Purchases
          </h2>
          {purchases.length === 0 ? (
            <p className="text-gray-400 text-sm">No purchases yet.</p>
          ) : (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-gray-900 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-medium">
                      {purchase.items.length} item(s)
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(purchase.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-bold text-tmdb-green">
                    {formatPrice(purchase.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 space-y-4 border border-red-500/30">
          <h2 className="font-semibold text-lg flex items-center gap-2 text-red-400">
            <FaTrash /> Danger Zone
          </h2>
          <p className="text-gray-400 text-sm">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm font-medium"
          >
            <FaTrash /> Delete Account
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm font-medium"
          >
            <FaUndo /> Reset
          </button>
          <button
            onClick={async () => {
              await handleSaveProfile();
              await handleSavePrefs();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-tmdb-light text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium disabled:opacity-50"
          >
            <FaSave /> Save
          </button>
        </div>
      </div>

      <Dialog
        isOpen={showDeleteDialog}
        title="Delete Account"
        confirmText={deleting ? 'Deleting...' : 'Delete Account'}
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteDialog(false)}
        confirmDisabled={deleting}
      >
        <p className="text-gray-300">
          Are you sure you want to permanently delete your account? All your favorites, cart, genre preferences, and purchase history will be removed.
        </p>
      </Dialog>
    </div>
  );
}
