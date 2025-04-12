"use client"; // This tells Next.js to render this component on the client side.

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // To read query parameters from the URL.
import VideoCard from './components/VideoCard'; // Custom component to display individual video cards.
import axios from 'axios'; // Library to make HTTP requests.

export default function Home() {
  const searchParams = useSearchParams(); // Hook to get current URL search parameters.
  
  // State hooks for videos, loading, error, and pagination data.
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalVideos: 0
  });

  // Extract query params from the URL
  const searchQuery = searchParams.get('query');
  const owner = searchParams.get('owner');
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 12;

  // useEffect triggers when searchQuery, owner, page, or limit changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true); // Start loading spinner
        const params = new URLSearchParams(); // Build URL query string

        // Append search filters to the query
        if (searchQuery) params.append('query', searchQuery);
        if (owner) params.append('owner', owner);
        params.append('page', page);
        params.append('limit', limit);
        params.append('sortBy', 'createdAt'); // Sort by date
        params.append('sortType', 'desc'); // Descending order (newest first)

        // Make request to the backend API
        const response = await axios.get(`http://localhost:8000/api/v2/videos?${params.toString()}`);
        
        // If response is okay, update videos and pagination data
        if (response.data && response.data.data) {
          setVideos(response.data.data.docs || []);
          setPagination({
            currentPage: response.data.data.page || 1,
            totalPages: response.data.data.totalPages || 0,
            totalVideos: response.data.data.totalDocs || 0
          });
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos'); // Show error message if request fails
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchVideos(); // Call the function
  }, [searchQuery, owner, page, limit]); // Dependencies that will re-trigger the effect

  // Pagination: changes the current page by updating the URL
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    window.location.href = `/?${params.toString()}`; // Redirect with new page number
  };

  // Show loading spinner while fetching
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Show error message if any */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}
      
      <div className="mt-6">
        {/* Show the heading based on query params */}
        <h1 className="text-2xl font-bold mb-4">
          {searchQuery 
            ? `Search results for "${searchQuery}"` 
            : owner 
              ? `Videos from ${owner}` 
              : 'Recommended Videos'}
        </h1>
        
        {/* If no videos, show a message */}
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No videos found</p>
          </div>
        ) : (
          <>
            {/* Grid of video cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map(video => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
            
            {/* Pagination controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  <span className="text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
