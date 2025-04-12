// Import necessary hooks and utilities
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

// Async function to fetch a single video by ID from the backend API
async function getVideo(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/v2/videos/single/${id}`);
    
    // If response is not OK (status code not 200-299), throw an error
    if (!res.ok) throw new Error("Video not found");

    // Parse the JSON response and return the video data
    const data = await res.json();
    return data?.data;
  } catch (error) {
    // Handle error gracefully
    console.error(error);
    return null;
  }
}

// Default export component that represents a single video page
export default function VideoPage({ params }) {
  const { id } = params; // Destructure the video ID from the route parameters
  const [video, setVideo] = useState(null); // State to store the fetched video data

  // Fetch the video when the component is mounted or when ID changes
  useEffect(() => {
    getVideo(id).then((data) => setVideo(data)); // Call getVideo and update state
  }, [id]);

  // Show loading state while video is being fetched
  if (!video) return <div>Loading...</div>;

  // Main UI once video is successfully fetched
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Video player section */}
      <div className="aspect-video mb-4">
        <video
          controls
          className="w-full h-full rounded-lg shadow-md"
          src={video.videoFile} // video source URL
          poster={video.thumbnail} // thumbnail image as poster
        />
      </div>

      {/* Video title */}
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

      {/* Creator info, view count, and relative upload time */}
      <div className="text-sm text-gray-500 mb-1">
        {video.owner?.fullname || video.owner?.username || 'Unknown creator'} •{' '}
        {video.views} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
      </div>

      {/* Video description */}
      <p className="text-gray-700 mt-4">{video.description}</p>
    </div>
  );
}
