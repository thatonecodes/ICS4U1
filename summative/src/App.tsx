import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/site/Layout';
import ProtectedRoute from '@/components/site/ProtectedRoute';
import HomeGate from '@/components/site/HomeGate';
import HomeView from '@/views/site/HomeView';
import MoviesView from '@/views/movies/MoviesView';
import TelevisionView from '@/views/tv/TelevisionView';
import TrendingView from '@/views/site/TrendingView';
import GenreView from '@/views/site/GenreView';
import MovieView from '@/views/movies/MovieView';
import CreditsView from '@/views/movies/CreditsView';
import TrailersView from '@/views/movies/TrailersView';
import ReviewsView from '@/views/movies/ReviewsView';
import SeasonsView from '@/views/tv/SeasonsView';
import EpisodeView from '@/views/tv/EpisodeView';
import PersonView from '@/views/person/PersonView';
import CareerView from '@/views/person/CareerView';
import ImagesView from '@/views/person/ImagesView';
import SearchView from '@/views/site/SearchView';
import SuccessView from '@/views/site/SuccessView';
import SignInView from '@/views/auth/SignInView';
import CartView from '@/views/user/CartView';
import FavoritesView from '@/views/user/FavoritesView';
import SettingsView from '@/views/user/SettingsView';
import ErrorView from '@/views/site/ErrorView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeGate />} />
        <Route path="/signin" element={<SignInView />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="home" element={<HomeView />} />
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
          <Route path="genre/:mediaType" element={<GenreView />} />
          <Route path="person/:id" element={<PersonView />} />
          <Route path="person/:id/career" element={<CareerView />} />
          <Route path="person/:id/images" element={<ImagesView />} />
          <Route path="search" element={<SearchView />} />
          <Route path="success" element={<SuccessView />} />
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
