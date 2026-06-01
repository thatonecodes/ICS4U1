import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import MoviesView from './views/MoviesView';
import TelevisionView from './views/TelevisionView';
import TrendingView from './views/TrendingView';
import GenreView from './views/GenreView';
import MovieView from './views/MovieView';
import CreditsView from './views/CreditsView';
import TrailersView from './views/TrailersView';
import ReviewsView from './views/ReviewsView';
import SeasonsView from './views/SeasonsView';
import EpisodeView from './views/EpisodeView';
import PersonView from './views/PersonView';
import CareerView from './views/CareerView';
import ImagesView from './views/ImagesView';
import SearchView from './views/SearchView';
import CartView from './views/CartView';
import FavoritesView from './views/FavoritesView';
import SettingsView from './views/SettingsView';
import ErrorView from './views/ErrorView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeView />} />
          <Route path="movies" element={<MoviesView />} />
          <Route path="movies/:id" element={<MovieView />} />
          <Route path="movies/:id/credits" element={<CreditsView />} />
          <Route path="movies/:id/trailers" element={<TrailersView />} />
          <Route path="movies/:id/reviews" element={<ReviewsView />} />
          <Route path="tv" element={<TelevisionView />} />
          <Route path="tv/:id" element={<MovieView />} />
          <Route path="tv/:id/credits" element={<CreditsView />} />
          <Route path="tv/:id/trailers" element={<TrailersView />} />
          <Route path="tv/:id/reviews" element={<ReviewsView />} />
          <Route path="tv/:id/seasons" element={<SeasonsView />} />
          <Route path="tv/:id/seasons/:seasonNumber" element={<EpisodeView />} />
          <Route path="trending" element={<TrendingView />} />
          <Route path="genre/:mediaType/:genreId" element={<GenreView />} />
          <Route path="person/:id" element={<PersonView />} />
          <Route path="person/:id/career" element={<CareerView />} />
          <Route path="person/:id/images" element={<ImagesView />} />
          <Route path="search" element={<SearchView />} />
          <Route path="cart" element={<CartView />} />
          <Route path="favorites" element={<FavoritesView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="*" element={<ErrorView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
