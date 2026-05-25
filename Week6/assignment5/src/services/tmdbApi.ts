import axios from "axios";
import type {
	ApiResponse,
	CareerRole,
	Credits,
	Episode,
	Genre,
	MediaDetails,
	Movie,
	Person,
	PersonDetails,
	PersonImage,
	Review,
	Season,
	TVShow,
	Video,
} from "../types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

if (!API_KEY) {
	console.warn(
		"TMDB API Key is missing. Please set VITE_TMDB_API_KEY in your .env file",
	);
}

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	config.params = { ...config.params, api_key: API_KEY };
	return config;
});

export const getImageUrl = (
	path: string | null,
	size: string = "w500",
): string => {
	if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
	return `${IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (
	path: string | null,
	size: string = "original",
): string => {
	if (!path) return "https://via.placeholder.com/1920x1080?text=No+Backdrop";
	return `${IMAGE_BASE}/${size}${path}`;
};

export const getMovies = (category: string, page: number = 1) =>
	api
		.get<ApiResponse<Movie>>(`/movie/${category}`, { params: { page } })
		.then((r) => r.data);

export const getMovieDetails = (id: number) =>
	api.get<MediaDetails>(`/movie/${id}`).then((r) => r.data);

export const getTVShows = (category: string, page: number = 1) =>
	api
		.get<ApiResponse<TVShow>>(`/tv/${category}`, { params: { page } })
		.then((r) => r.data);

export const getTVDetails = (id: number) =>
	api.get<MediaDetails>(`/tv/${id}`).then((r) => r.data);

export const getTrending = (
	mediaType: "movie" | "tv" | "all",
	timeWindow: "day" | "week",
	page: number = 1,
) =>
	api
		.get<ApiResponse<Movie | TVShow>>(`/trending/${mediaType}/${timeWindow}`, {
			params: { page },
		})
		.then((r) => r.data);

export const getGenres = (mediaType: "movie" | "tv") =>
	api
		.get<{ genres: Genre[] }>(`/genre/${mediaType}/list`)
		.then((r) => r.data.genres);

export const discoverByGenre = (
	mediaType: "movie" | "tv",
	genreId: number,
	page: number = 1,
) =>
	api
		.get<ApiResponse<Movie | TVShow>>(`/discover/${mediaType}`, {
			params: { with_genres: genreId, page, sort_by: "popularity.desc" },
		})
		.then((r) => r.data);

export const getCredits = (mediaType: "movie" | "tv", id: number) =>
	api.get<Credits>(`/${mediaType}/${id}/credits`).then((r) => r.data);

export const getVideos = (mediaType: "movie" | "tv", id: number) =>
	api
		.get<{ results: Video[] }>(`/${mediaType}/${id}/videos`)
		.then((r) => r.data.results);

export const getReviews = (
	mediaType: "movie" | "tv",
	id: number,
	page: number = 1,
) =>
	api
		.get<ApiResponse<Review>>(`/${mediaType}/${id}/reviews`, {
			params: { page },
		})
		.then((r) => r.data);

export const getSeasons = (tvId: number) =>
	api.get<{ seasons: Season[] }>(`/tv/${tvId}`).then((r) => r.data.seasons);

export const getSeasonDetails = (tvId: number, seasonNumber: number) =>
	api
		.get<{
			episodes: Episode[];
			name: string;
			overview: string;
			poster_path: string | null;
		}>(`/tv/${tvId}/season/${seasonNumber}`)
		.then((r) => r.data);

export const getPersonDetails = (id: number) =>
	api.get<PersonDetails>(`/person/${id}`).then((r) => r.data);

export const getPersonCredits = (id: number) =>
	api
		.get<{ cast: CareerRole[]; crew: CareerRole[] }>(
			`/person/${id}/combined_credits`,
		)
		.then((r) => r.data);

export const getPersonImages = (id: number) =>
	api
		.get<{ profiles: PersonImage[] }>(`/person/${id}/images`)
		.then((r) => r.data.profiles);

export const searchMulti = (query: string, page: number = 1) =>
	api
		.get<ApiResponse<Movie | TVShow | Person>>(`/search/multi`, {
			params: { query, page },
		})
		.then((r) => r.data);

export const searchMovies = (query: string, page: number = 1) =>
	api
		.get<ApiResponse<Movie>>(`/search/movie`, { params: { query, page } })
		.then((r) => r.data);

export const searchTV = (query: string, page: number = 1) =>
	api
		.get<ApiResponse<TVShow>>(`/search/tv`, { params: { query, page } })
		.then((r) => r.data);

export const searchPeople = (query: string, page: number = 1) =>
	api
		.get<ApiResponse<Person>>(`/search/person`, { params: { query, page } })
		.then((r) => r.data);
