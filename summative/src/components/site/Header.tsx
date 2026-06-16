import { Link, useLocation } from 'react-router-dom';
import { FaFilm, FaTv, FaFire, FaHome, FaThLarge, FaHeart, FaShoppingCart, FaCog } from 'react-icons/fa';
import { useUserContext } from '@/hooks';
import SearchBar from '@/components/controls/SearchBar';

export default function Header() {
  const location = useLocation();
  const { userName, favorites, cart } = useUserContext();

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

          <div className="flex items-center gap-2">
            <SearchBar />
            <div className="flex items-center gap-1 ml-2">
              <Link
                to="/favorites"
                className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition"
                title="Favorites"
              >
                <FaHeart />
                {favorites.size > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
                    {favorites.size}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition"
                title="Cart"
              >
                <FaShoppingCart />
                {cart.size > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-tmdb-green text-[10px] text-gray-900 font-bold">
                    {cart.size}
                  </span>
                )}
              </Link>
              <Link
                to="/settings"
                className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition"
                title="Settings"
              >
                <FaCog />
              </Link>
              <span className="hidden lg:inline text-sm text-gray-400 ml-2 border-l border-gray-700 pl-3">
                {userName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
