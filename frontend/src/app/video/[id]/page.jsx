'use client';
import { use } from 'react';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

// fetch video by id
async function getVideo(id) {
  try {
    const res = await axios.get(`http://localhost:8000/api/v2/videos/single/${id}`);
    return res.data?.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// page component
export default function VideoPage({ params }) {
  const { id } = use(params); // ✅ unwrap the promise

  const [video, setVideo] = useState(null);

  useEffect(() => {
    getVideo(id).then((data) => setVideo(data));
  }, [id]);

  if (!video) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="aspect-video mb-4">
        <video
          controls
          className="w-full h-full rounded-lg shadow-md"
          src={video.videoFile}
          poster={video.thumbnail}
        />
      </div>

      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

      <div className="text-sm text-gray-500 mb-1">
        {video.owner?.fullname || video.owner?.username || 'Unknown creator'} •{' '}
        {video.views} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
      </div>

      <p className="text-gray-700 mt-4">{video.description}</p>
    </div>
  );
}
