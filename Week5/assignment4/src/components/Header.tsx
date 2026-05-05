import { Link, useLocation } from 'react-router-dom';
import { FaFilm, FaTv, FaFire, FaHome, FaThLarge } from 'react-icons/fa';
import SearchBar from './SearchBar';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-md transition ${
      isActive(path)
        ? 'bg-tmdb-light text-white'
        : 'text-gray-300 hover:text-white hover:bg-gray-800'
    }`;

  return (
    <header className="bg-tmdb-dark sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-tmdb-green">
            <FaFilm />
            <span className="hidden sm:inline">TMDB Explorer</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}>
              <FaHome /> Home
            </Link>
            <Link to="/movies" className={navLinkClass('/movies')}>
              <FaFilm /> Movies
            </Link>
            <Link to="/tv" className={navLinkClass('/tv')}>
              <FaTv /> TV Shows
            </Link>
            <Link to="/trending" className={navLinkClass('/trending')}>
              <FaFire /> Trending
            </Link>
            <Link to="/genre/movie/28" className={navLinkClass('/genre')}>
              <FaThLarge /> Genres
            </Link>
          </nav>

          <SearchBar />
        </div>
      </div>
    </header>
  );
}
