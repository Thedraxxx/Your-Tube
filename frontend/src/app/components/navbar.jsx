'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/authcontext';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/users/logout`, {
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
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-red-500 font-extrabold text-2xl">YourTube</span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link href="/upload" className="p-2 rounded-full hover:bg-zinc-800 transition">
                  <Upload size={22} />
                </Link>
                <Link href="/auth/profile" className="p-2 rounded-full hover:bg-zinc-800 transition">
                  <UserCircle size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-zinc-800 transition"
                >
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition"
              >
                <LogIn size={18} className="mr-1" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
