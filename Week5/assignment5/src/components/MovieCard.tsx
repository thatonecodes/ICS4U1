import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { BsCart2, BsCartFill } from 'react-icons/bs';
import type { Movie } from '../types';
import { getImageUrl } from '../services/tmdbApi';
import { useUserContext } from '../hooks';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { favorites, cart, toggleFavorite, toggleCart } = useUserContext();
  const isFav = favorites.has(movie.id);
  const inCart = cart.has(movie.id);

  const userItem = {
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    date: movie.release_date,
    mediaType: 'movie' as const,
  };

  return (
    <div className="group relative block">
      <Link to={`/movies/${movie.id}`}>
        <div className="relative rounded-lg overflow-hidden bg-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-105">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-white truncate group-hover:text-tmdb-light transition">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-400">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </p>
          </div>
        </div>
      </Link>
      <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(userItem);
          }}
          className="rounded-full bg-black/60 p-2 backdrop-blur-sm hover:bg-black/80 transition"
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-white" />}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCart(userItem);
          }}
          className="rounded-full bg-black/60 p-2 backdrop-blur-sm hover:bg-black/80 transition"
          title={inCart ? 'Remove from cart' : 'Add to cart'}
        >
          {inCart ? <BsCartFill className="text-tmdb-green" /> : <BsCart2 className="text-white" />}
        </button>
      </div>
    </div>
  );
}
