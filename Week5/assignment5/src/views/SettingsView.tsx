import { useState } from 'react';
import { FaCog, FaSave, FaUndo } from 'react-icons/fa';
import { useUserContext } from '../hooks';

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

export default function SettingsView() {
  const { userName, setUserName, genrePreferences, setGenrePreferences } = useUserContext();
  const [nameValue, setNameValue] = useState(userName);
  const [nameError, setNameError] = useState('');
  const [prefs, setPrefs] = useState(genrePreferences);

  const toggleGenre = (media: 'movie' | 'tv', id: number) => {
    setPrefs((prev) => {
      const current = prev[media];
      const updated = current.includes(id)
        ? current.filter((g) => g !== id)
        : [...current, id];
      return { ...prev, [media]: updated };
    });
  };

  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (!trimmed) {
      setNameError('Username cannot be empty');
      return;
    }
    setUserName(trimmed);
    setNameError('');
  };

  const handleSavePrefs = () => {
    setGenrePreferences(prefs);
  };

  const handleReset = () => {
    setNameValue('User');
    setNameError('');
    setPrefs({ movie: [], tv: [] });

    setUserName('User');
    setGenrePreferences({ movie: [], tv: [] });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <FaCog className="text-tmdb-light" /> Settings
      </h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-lg">Profile</h2>
            <p className="text-gray-400 text-sm">Update your display name</p>
          </div>
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">Username</label>
            <input
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tmdb-light transition"
              onChange={(e) => {
                setNameValue(e.target.value);
                setNameError('');
              }}
              placeholder="Enter your name"
              type="text"
              value={nameValue}
            />
            {nameError && <p className="text-red-400 text-sm">{nameError}</p>}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
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
            <h3 className="text-sm font-medium text-gray-300 mb-2">TV Shows</h3>
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

        <div className="flex justify-end gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm font-medium"
          >
            <FaUndo /> Reset
          </button>
          <button
            onClick={() => {
              handleSaveName();
              handleSavePrefs();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-tmdb-light text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
          >
            <FaSave /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
