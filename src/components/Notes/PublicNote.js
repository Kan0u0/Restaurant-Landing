import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const PublicNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (!id) {
          setError('Invalid note ID');
          setLoading(false);
          return;
        }

        const noteRef = doc(db, 'notes', id);
        const noteSnap = await getDoc(noteRef);
        
        if (!noteSnap.exists()) {
          setError('Note not found');
          setLoading(false);
          return;
        }
        
        const noteData = noteSnap.data();
        
        // Check if note is public
        if (!noteData.isPublic) {
          setError('This note is private');
          setLoading(false);
          return;
        }
        
        setNote({
          id: noteSnap.id,
          ...noteData
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching note:', err);
        setError('Error loading note');
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  // Format the date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Unknown date';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-700 dark:text-gray-300 text-lg">Loading note...</p>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">{error}</h2>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white break-words">
              {note.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Last updated: {formatDate(note.updatedAt)}
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
              {note.content}
            </div>
          </div>
          
          {note.tags && note.tags.length > 0 && (
            <div className="px-4 pb-5 sm:px-6">
              <div className="flex flex-wrap gap-2 mt-4">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNote;