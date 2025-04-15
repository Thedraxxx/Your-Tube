"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VideoCard from "./components/VideoCard";
import axios from "axios";

export default function HomeContent() {
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalVideos: 0,
  });

  const searchQuery = searchParams.get("query");
  const owner = searchParams.get("owner");
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 12;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (searchQuery) params.append("query", searchQuery);
        if (owner) params.append("owner", owner);
        params.append("page", page);
        params.append("limit", limit);
        params.append("sortBy", "createdAt");
        params.append("sortType", "desc");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/videos?${params.toString()}`
        );

        if (response.data && response.data.data) {
          setVideos(response.data.data.docs || []);
          setPagination({
            currentPage: response.data.data.page || 1,
            totalPages: response.data.data.totalPages || 0,
            totalVideos: response.data.data.totalDocs || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery, owner, page, limit]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    window.location.href = `/?${params.toString()}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-4">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : owner
            ? `Videos from ${owner}`
            : "Recommended Videos"}
        </h1>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No videos found</p>
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
                    onClick={() =>
                      handlePageChange(pagination.currentPage - 1)
                    }
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() =>
                      handlePageChange(pagination.currentPage + 1)
                    }
                    disabled={
                      pagination.currentPage === pagination.totalPages
                    }
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
