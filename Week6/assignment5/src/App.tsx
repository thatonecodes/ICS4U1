import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CareerView from "./views/CareerView";
import CreditsView from "./views/CreditsView";
import EpisodeView from "./views/EpisodeView";
import ErrorView from "./views/ErrorView";
import GenreView from "./views/GenreView";
import HomeView from "./views/HomeView";
import ImagesView from "./views/ImagesView";
import MoviesView from "./views/MoviesView";
import MovieView from "./views/MovieView";
import PersonView from "./views/PersonView";
import ReviewsView from "./views/ReviewsView";
import SearchView from "./views/SearchView";
import SeasonsView from "./views/SeasonsView";
import TelevisionView from "./views/TelevisionView";
import TrailersView from "./views/TrailersView";
import TrendingView from "./views/TrendingView";

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
					<Route
						path="tv/:id/seasons/:seasonNumber"
						element={<EpisodeView />}
					/>
					<Route path="trending" element={<TrendingView />} />
					<Route path="genre/:mediaType/:genreId" element={<GenreView />} />
					<Route path="person/:id" element={<PersonView />} />
					<Route path="person/:id/career" element={<CareerView />} />
					<Route path="person/:id/images" element={<ImagesView />} />
					<Route path="search" element={<SearchView />} />
					<Route path="*" element={<ErrorView />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
