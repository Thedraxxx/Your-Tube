"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import Image from "next/image";

export default function ProfileSummary() {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]); // New state for videos
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/users/current-user`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("Fetched data:", data);

        if (data?.data) {
          setUser(data.data); // set the user
        } else {
          console.error("User data is missing or has an incorrect structure.");
        }
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    fetchUser();
  }, [isAuthenticated, router]);

  // ✅ Second useEffect to fetch videos after user is set
  useEffect(() => {
    if (!user?._id) return;

    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/videos/userVideos`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("Fetched videos:", data);

        if (data?.data) {
          setVideos(data.data);
        } else {
          console.error("No videos found for the user.");
        }
      } catch (err) {
        console.error("Failed to load videos", err);
      }
    };

    fetchVideos();
  }, [user]);
  const handleChange = (id) => {
    router.push(`/video/${id}`);
  };

  if (!user)
    return <div className="text-white text-center py-4">Loading...</div>;

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/videos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (res.ok) {
        setVideos((prev) => prev.filter((vid) => vid._id !== id));
        alert("Video deleted successfully.");
      } else {
        const data = await res.json();
        console.error("Error deleting video:", data.message);
        alert("Failed to delete video.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting.");
    }
  };
  

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center">
      {/* Cover Image */}
      {user.coverImage ? (
        <div className="w-full h-64 relative overflow-hidden rounded-lg shadow-md">
          <Image
            src={user.coverImage}
            alt="Cover"
            fill
            className="object-cover opacity-80"
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-800 rounded-lg shadow-md" />
      )}

      {/* Profile Info */}
      <div className="w-full p-6 flex flex-col items-center bg-gray-900 rounded-b-lg shadow-lg mt-6">
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-gray-700 shadow-lg">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="Avatar"
              width={112}
              height={112}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700" />
          )}
        </div>

        {/* Full Name */}
        <h1 className="text-3xl font-semibold text-center">
          {user.fullname || "Unknown User"}
        </h1>

        {/* Username */}
        <p className="text-gray-400 text-sm mt-2">
          @{user.username || "No Username"}
        </p>

        {/* Email */}
        <p className="text-gray-500 text-sm mt-2">{user.email || "No Email"}</p>
      </div>

      {/* Video Section */}
      <div className="w-full p-6 mt-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center text-white mb-4">
          Your Videos
        </h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-gray-700 rounded-lg overflow-hidden shadow-md group relative"
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={300}
                  height={200}
                  className="object-cover w-full h-48 cursor-pointer"
                  onClick={() => handleChange(video._id)}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{video.views} views</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Buttons (Edit/Delete) */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => router.push(`/video/edit-video/${video._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            You have not posted any videos yet.
          </p>
        )}
      </div>
    </div>
  );
}
