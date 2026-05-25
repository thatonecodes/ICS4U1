/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				tmdb: {
					dark: "#0d253f",
					light: "#01b4e4",
					green: "#90cea1",
				},
			},
		},
	},
	plugins: [],
};
