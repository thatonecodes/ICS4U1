import { FaGithub, FaHeart, FaLinkedin } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-tmdb-dark mt-12 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="text-gray-400 text-sm">
						<p className="flex items-center gap-1">
							Made with <FaHeart className="text-red-500" /> using React, Vite &
							Tailwind
						</p>
						<p className="mt-1">Data provided by TMDB API</p>
					</div>
					<div className="flex items-center gap-4">
						<a
							href="https://github.com/thatonecodes"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-gray-400 hover:text-white transition"
						>
							<FaGithub className="text-xl" />
							<span>GitHub</span>
						</a>
						<a
							href="https://linkedin.com/in/thatonecodes"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-gray-400 hover:text-white transition"
						>
							<FaLinkedin className="text-xl" />
							<span>LinkedIn</span>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
