"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import Image from "next/image";

export default function ProfileSummary() {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
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
        if (data?.data) {
          setUser(data.data);
        } else {
          console.error("User data is missing or has an incorrect structure.");
        }
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    fetchUser();
  }, [isAuthenticated, router]);

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

  if (!user)
    return <div className="text-white text-center py-6 text-lg animate-pulse">Loading profile...</div>;

  return (
    <div className="bg-[#0f172a] text-white min-h-screen px-4 sm:px-8 py-8">
      {/* Cover Image */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg mb-10">
        {user.coverImage ? (
          <Image
            src={user.coverImage}
            alt="Cover"
            fill
            className="object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg text-center max-w-xl mx-auto mb-10 animate-fadeIn">
        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-gray-600 shadow-md mb-4">
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
        <h1 className="text-2xl font-bold">{user.fullname || "Unknown User"}</h1>
        <p className="text-gray-400 text-sm mt-1">@{user.username || "No Username"}</p>
        <p className="text-gray-500 text-sm mt-1">{user.email || "No Email"}</p>
      </div>

      {/* Videos Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">Your Videos</h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-[#1e293b] rounded-lg overflow-hidden shadow-md group hover:scale-[1.02] transition-transform duration-200"
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => handleChange(video._id)}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-gray-400 text-sm">{video.views} views</p>
                  <p className="text-gray-500 text-xs">{new Date(video.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => router.push(`/video/edit-video/${video._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm shadow"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-6">You have not posted any videos yet.</p>
        )}
      </div>
    </div>
  );
}
