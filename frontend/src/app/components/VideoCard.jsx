"use client"
import { useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import { formatDistanceToNow } from 'date-fns';
import ensureHttps from '../utils/httpSolution';

export default function VideoCard({ video }) {
  const [imageError, setImageError] = useState(false);

  // Extract video data
  const {
    _id,
    thumbnail,
    title,
    duration = 0,
    views = 0,
    owner,
    createdAt
  } = video;

  // Format duration (assuming duration is in seconds)
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Format views (e.g., 1.5K, 1.2M)
  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Format upload date
  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'some time ago';
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/video/${_id}`}>
        <div className="relative">
          {/* Thumbnail */}
          <div className="aspect-video relative bg-gray-200">
            {thumbnail && !imageError ? (
              <img
                src={ensureHttps(thumbnail)}
                alt={title}
                className="object-cover w-full h-full"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No thumbnail</span>
              </div>
            )}
          </div>

          {/* Duration badge */}
          {duration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
              {formatDuration(duration)}
            </div>
          )}
        </div>

        <div className="p-3">
          {/* Video title */}
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{title}</h3>

          {/* Channel name and video stats */}
          <div className="text-sm text-gray-600">
            {owner?.fullname || owner?.username || 'Unknown creator'}
          </div>

          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span>{formatViews(views)} views</span>
            <span className="mx-1">•</span>
            <span>{getTimeAgo(createdAt)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
