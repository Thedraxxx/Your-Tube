"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import CommentSection from "@/app/components/comment";
import ensureHttps from "@/app/utils/httpSolution";


// fetch video by id
async function getVideo(id) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/videos/single/${id}`
    );
    return res.data?.data;
  } catch (error) {
    console.error("Failed to fetch video:", error);
    return null;
  }
}

// fetch subscription status
async function getSubscriptionStatus(channelId) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/subscribers/status/${channelId}`,
      { withCredentials: true }
    );
    return res.data?.data?.isSubscribed || false;
  } catch (error) {
    console.error("Failed to fetch subscription status:", error);
    return false;
  }
}

// fetch like status
async function getLikeStatus(videoId) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/likes/status/${videoId}`,
      { withCredentials: true }
    );
    return res.data?.data?.isLiked || false;
  } catch (error) {
    console.error("Failed to fetch like status:", error);
    return false;
  }
}

export default function VideoPage({ params }) {
  const { id } = use(params);
  const [video, setVideo] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch video data first
    getVideo(id).then(async (data) => {
      if (data) {
        setVideo(data);

        if (isAuthenticated) {
          // Fetch subscription status
          const status = await getSubscriptionStatus(data.owner._id);
          setSubscribed(status);

          // Fetch like status
          const likeStatus = await getLikeStatus(id);
          setIsLiked(likeStatus);
        }
      }
    });
  }, [id, isAuthenticated]);
   const router = useRouter();
  const handleSubscribeToggle = async () => {
    if (!isAuthenticated) {
        router.push("/auth/login")
        return
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/subscribers/subscribe/${video.owner._id}`,
        {},
        { withCredentials: true }
      );
      setSubscribed(res.data.data?.isSubscribed);
    } catch (error) {
      console.error(
        "Subscription failed:",
        error.response?.data || error.message
      );
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/likes/toggle/${id}`,
        {},
        { withCredentials: true }
      );
      setIsLiked((prev) => !prev); // Toggle like state
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="aspect-video mb-4">
        <video
          controls
          className="w-full h-full rounded-lg shadow-md"
          src={ensureHttps(video.videoFile)}
          poster={ensureHttps(video.thumbnail)}
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

      {/* Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="text-sm text-gray-500">
          {video.owner?.fullname || video.owner?.username || "Unknown creator"}{" "}
          • {video.views} views •{" "}
          {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
        </div>

        <div className="flex gap-4 items-center">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              isLiked
                ? "bg-blue-700 text-white"
                : "bg-blue-600 text-white hover:bg-blue-800"
            }`}
          >
            {isLiked ? " Liked" : " Like"}
          </button>

          {/* Subscribe Button */}
          <div className="flex flex-col items-start">
            <button
              onClick={handleSubscribeToggle}
              disabled={!isAuthenticated}
              className={`px-4 py-2 font-semibold rounded-full transition ${
                subscribed
                  ? "bg-gray-300 text-black hover:bg-gray-400"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
            {!isAuthenticated && (
              <span className="text-xs text-gray-500 mt-1">
                Login to subscribe
              </span>
            )}
          </div>
        </div>
      </div>
       
      {/* Description */}
      <p className="text-gray-700 mt-2 whitespace-pre-line">
        {video.description}
      </p>
      <CommentSection videoId={video._id} />
    </div>
  );
}
