import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows, people..."
          className="w-64 md:w-80 pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tmdb-light transition"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-tmdb-light text-white rounded-full hover:bg-blue-600 transition font-medium"
      >
        Search
      </button>
    </form>
  );
}
