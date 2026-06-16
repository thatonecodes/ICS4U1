import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '@/hooks';

export default function UserMenu() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="ml-2 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUser />
        )}
        <span className="hidden lg:inline">{currentUser.displayName || currentUser.email}</span>
        <FaChevronDown className={`text-xs transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-medium truncate">{currentUser.displayName || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
          </div>
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition"
          >
            <FaCog /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition text-left"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
