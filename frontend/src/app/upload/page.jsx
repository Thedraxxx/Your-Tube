"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, ImagePlus } from 'lucide-react';
import { useAuth } from '../context/authcontext';

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the global auth context instead of local state
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // This replaces your current useEffect
  useEffect(() => {
    // If auth check is completed (via context) and user is not authenticated
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push('/auth/login'); 
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  // Rest of your functions remain the same
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }
    setVideoFile(file);
    setError('');
  };

  // Other functions and JSX remain unchanged
  // ...
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) {
      setError('Please select a valid image thumbnail');
      return;
    }
    setThumbnailFile(file);
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return setError('Please select a video file to upload');
    if (!videoTitle.trim()) return setError('Please enter a title');

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('videos', videoFile);
    formData.append('title', videoTitle);
    formData.append('description', videoDescription);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    try {
      const uploadTimer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(uploadTimer);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      const response = await fetch('http://localhost:8000/api/v2/videos/publish', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      clearInterval(uploadTimer);
      setUploadProgress(100);

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      setTimeout(() => router.push(`/`), 1000);
    } catch (error) {
      setError(error.message || 'An error occurred during upload');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="dark min-h-screen bg-zinc-900 text-white px-4 py-8">
      <div className="max-w-2xl mx-auto bg-zinc-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload a Video</h1>

        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Video File</label>
            <div className="flex flex-col items-center border-2 border-dashed border-gray-500 rounded-md p-4">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <label htmlFor="video-upload" className="cursor-pointer text-red-400 hover:text-red-500">
                <span>Choose a video</span>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="sr-only"
                  onChange={handleVideoChange}
                  disabled={isUploading}
                />
              </label>
              {videoFile && <p className="text-sm mt-2 text-green-400">{videoFile.name}</p>}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail Image</label>
            <div className="flex flex-col items-center border-2 border-dashed border-gray-500 rounded-md p-4">
              <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
              <label htmlFor="thumbnail-upload" className="cursor-pointer text-red-400 hover:text-red-500">
                <span>Choose a thumbnail</span>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleThumbnailChange}
                  disabled={isUploading}
                />
              </label>
              {thumbnailFile && <p className="text-sm mt-2 text-green-400">{thumbnailFile.name}</p>}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input
              type="text"
              id="title"
              className="w-full mt-1 rounded-md px-3 py-2 bg-zinc-700 border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Your video title"
              required
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea
              id="description"
              rows="4"
              className="w-full mt-1 rounded-md px-3 py-2 bg-zinc-700 border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              disabled={isUploading}
            />
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="mt-4">
              <div className="mb-2 text-xs text-red-400">{uploadProgress === 100 ? 'Processing...' : `Uploading: ${uploadProgress}%`}</div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-500 text-gray-300 hover:bg-zinc-700"
              onClick={() => router.push('/')}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold ${
                isUploading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






