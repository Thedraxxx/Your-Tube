'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/authcontext';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';


export default function CommentSection({ videoId }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
 
  // Fetch comments for the video
  useEffect(() => {
    if (!videoId) return;
    
    const fetchComments = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/comments/${videoId}?page=${page}&limit=10`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        
        const data = await response.json();
        
        if (page === 1) {
          setComments(data.data);
        } else {
          setComments(prev => [...prev, ...data.data]);
        }
        
        // Check if there are more comments to load
        setHasMore(data.data.length === 10);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      }
    };
    
    fetchComments();
  }, [videoId, page]);

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to comment');
     
      return;
    }
    
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/comments/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: newComment })
      });
      
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      const data = await response.json();
      
      // Reset form and refresh comments
      setNewComment('');
      setIsCommenting(false);
      
      // Refresh comments by resetting page to 1
      setPage(1);
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/comments/${videoId}?page=1&limit=10`, {
        credentials: 'include'
      });
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setComments(refreshData.data);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle loading more comments
  const loadMoreComments = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Comment count display */}
      <h3 className="text-lg font-semibold mb-4">{comments.length} Comments</h3>
      
      {/* Comment input section */}
      <div className="flex gap-4 mb-8">
      
        
        <div className="flex-1">
          {isCommenting ? (
            <>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              
              <div className="flex justify-end mt-2 gap-2">
                <button
                  className="px-4 py-2 text-gray-600 font-medium rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setIsCommenting(false);
                    setNewComment('');
                    setError('');
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed`}
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </>
          ) : (
            <div 
              className="w-full p-2 border border-gray-200 rounded-md text-gray-500 cursor-pointer hover:border-gray-300"
              onClick={() => {
                if (isAuthenticated) {
                  setIsCommenting(true);
                } else {
                  alert('Please sign in to comment');
                }
              }}
            >
              Add a comment...
            </div>
          )}
        </div>
      </div>
      
      {/* Comments list */}
      <div className="space-y-6">
        {isLoading && comments.length === 0 ? (
          <div className="text-center py-4">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <Image 
                  src={comment.ownerDetails.avatar || "/api/placeholder/40/40"} 
                  alt={comment.ownerDetails.username} 
                  width={40} 
                  height={40} 
                  className="object-cover" 
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {comment.ownerDetails.username || comment.ownerDetails.fullname}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="mt-1 text-sm">{comment.content}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 10v12m8-16v16M7 22h10M7 6a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2H7V6z" />
                    </svg>
                    <span className="text-xs">Like</span>
                  </button>
                  
                  <button 
                    className="text-xs text-gray-600 hover:text-gray-900"
                    onClick={() => {
                      if (isAuthenticated) {
                        setIsCommenting(true);
                        setNewComment(`@${comment.ownerDetails.username} `);
                      } else {
                        alert('Please sign in to reply');
                      }
                    }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Load more button */}
        {hasMore && comments.length > 0 && (
          <div className="text-center pt-4">
            <button 
              className="px-4 py-2 text-blue-500 font-medium hover:bg-blue-50 rounded-full"
              onClick={loadMoreComments}
            >
              Load more comments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}