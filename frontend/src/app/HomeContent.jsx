"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VideoCard from "./components/VideoCard";
import axios from "axios";

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalVideos: 0,
  });
  const [sortOptions, setSortOptions] = useState({
    sortBy: "createdAt",
    sortType: "desc"
  });

  // Extract URL params
  const searchQuery = searchParams.get("query") || "";
  const owner = searchParams.get("owner");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortType = searchParams.get("sortType") || "desc";

  // Initialize search input with the current query
  useEffect(() => {
    setSearchInput(searchQuery);
    setSortOptions({
      sortBy: sortBy,
      sortType: sortType
    });
  }, [searchQuery, sortBy, sortType]);

  // Fetch videos based on search parameters
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (searchQuery) params.append("query", searchQuery);
        if (owner) params.append("owner", owner);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        params.append("sortBy", sortOptions.sortBy);
        params.append("sortType", sortOptions.sortType);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/videos?${params.toString()}`
        );

        if (response.data && response.data.data) {
          // Ensure all video URLs use HTTPS
          const secureVideos = response.data.data.docs.map(video => ({
            ...video,
            videoFile: video.videoFile ? video.videoFile.replace('http://', 'https://') : video.videoFile,
            thumbnail: video.thumbnail ? video.thumbnail.replace('http://', 'https://') : video.thumbnail
          }));
          
          setVideos(secureVideos || []);
          setPagination({
            currentPage: response.data.data.page || 1,
            totalPages: response.data.data.totalPages || 0,
            totalVideos: response.data.data.totalDocs || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery, owner, page, limit, sortOptions.sortBy, sortOptions.sortType]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim() && !searchQuery) return;
    
    const params = new URLSearchParams(searchParams);
    
    if (searchInput.trim()) {
      params.set("query", searchInput.trim());
    } else {
      params.delete("query");
    }
    
    // Reset to page 1 when searching
    params.set("page", "1");
    
    router.push(`/?${params.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const [newSortBy, newSortType] = e.target.value.split('-');
    
    setSortOptions({
      sortBy: newSortBy,
      sortType: newSortType
    });
    
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", newSortBy);
    params.set("sortType", newSortType);
    params.set("page", "1"); // Reset to first page when changing sort
    
    router.push(`/?${params.toString()}`);
  };

  // Handle page navigation
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  // Clear search filters
  const clearFilters = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={`${sortOptions.sortBy}-${sortOptions.sortType}`}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Newest</option>
              <option value="createdAt-asc">Oldest</option>
              <option value="views-desc">Most Viewed</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
            
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            
            {(searchQuery || owner) && (
              <button 
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold mb-4">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : owner
            ? `Videos from ${owner}`
            : "Recommended Videos"}
        </h1>

        {pagination.totalVideos > 0 && (
          <p className="text-gray-600 mb-4">
            Showing {Math.min((page - 1) * limit + 1, pagination.totalVideos)} - {Math.min(page * limit, pagination.totalVideos)} of {pagination.totalVideos} videos
          </p>
        )}

        {videos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600 mb-2">No videos found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    First
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded ${
                            pagination.currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Last
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