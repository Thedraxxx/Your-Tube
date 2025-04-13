'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Upload, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/authcontext';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth(); // Use auth from context
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // handleSearch function remains the same
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // handleLogout function remains the same
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v2/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        alert('Logged out successfully');
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-zinc-900 shadow-md sticky top-0 z-10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-red-500 font-bold text-xl">YourTube</span>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:mr-6">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="w-full h-10 pl-4 pr-10 rounded-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-10 w-10 text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/upload" className="text-zinc-300 hover:text-red-500 flex items-center">
                  <Upload className="mr-1" size={20} />
                  <span className="hidden md:inline">Upload</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-zinc-300 hover:text-red-500 flex items-center"
                >
                  <LogOut className="mr-1" size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="text-zinc-300 hover:text-red-500 flex items-center">
                <LogIn className="mr-1" size={20} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
