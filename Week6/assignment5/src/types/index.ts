export interface Movie {
	id: number;
	title: string;
	poster_path: string | null;
	backdrop_path: string | null;
	overview: string;
	release_date: string;
	vote_average: number;
	genre_ids: number[];
	original_language: string;
}

export interface TVShow {
	id: number;
	name: string;
	poster_path: string | null;
	backdrop_path: string | null;
	overview: string;
	first_air_date: string;
	vote_average: number;
	genre_ids: number[];
	original_language: string;
	popularity: number;
}

export interface MediaDetails {
	id: number;
	title?: string;
	name?: string;
	poster_path: string | null;
	backdrop_path: string | null;
	overview: string;
	vote_average: number;
	vote_count: number;
	genres: { id: number; name: string }[];
	runtime?: number;
	episode_run_time?: number[];
	release_date?: string;
	first_air_date?: string;
	last_air_date?: string;
	number_of_seasons?: number;
	number_of_episodes?: number;
	status: string;
	tagline: string;
	homepage: string;
	original_language: string;
	popularity: number;
}

export interface Person {
	id: number;
	name: string;
	profile_path: string | null;
	known_for_department: string;
	popularity: number;
}

export interface PersonDetails {
	id: number;
	name: string;
	biography: string;
	profile_path: string | null;
	birthday: string | null;
	deathday: string | null;
	place_of_birth: string | null;
	known_for_department: string;
	popularity: number;
	also_known_as: string[];
	gender: number;
	homepage: string | null;
}

export interface CastMember {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
}

export interface CrewMember {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path: string | null;
}

export interface Credits {
	cast: CastMember[];
	crew: CrewMember[];
}

export interface Video {
	id: string;
	key: string;
	name: string;
	site: string;
	type: string;
	official: boolean;
}

export interface Review {
	id: string;
	author: string;
	content: string;
	created_at: string;
	author_details: {
		rating: number | null;
		avatar_path: string | null;
	};
}

export interface Season {
	id: number;
	name: string;
	overview: string;
	season_number: number;
	episode_count: number;
	poster_path: string | null;
	air_date: string;
}

export interface Episode {
	id: number;
	name: string;
	overview: string;
	episode_number: number;
	season_number: number;
	still_path: string | null;
	air_date: string;
	vote_average: number;
	runtime: number | null;
}

export interface CareerRole {
	id: number;
	title?: string;
	name?: string;
	character?: string;
	job?: string;
	media_type: string;
	poster_path: string | null;
	release_date?: string;
	first_air_date?: string;
	vote_average: number;
}

export interface PersonImage {
	file_path: string;
	aspect_ratio: number;
	height: number;
	width: number;
}

export interface Genre {
	id: number;
	name: string;
}

export interface ApiResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}
