// src/components/NotesDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import NavBar from '../layout/Navbar';
import { FaPen, FaSearch, FaSort, FaEllipsisV } from 'react-icons/fa';

const NotesDashboard = ({ user, darkMode, toggleDarkMode }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [category, setCategory] = useState('all');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      const userNotesRef = collection(db, 'notes');
      const q = query(userNotesRef, where('userId', '==', user.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let notesData = [];
        
        snapshot.forEach(doc => {
          const data = doc.data();
          notesData.push({
            id: doc.id,
            ...data,
            updatedAt: data.updatedAt || { seconds: 0 }
          });
        });

        notesData.sort((a, b) => {
          const aTime = a.updatedAt?.seconds || 0;
          const bTime = b.updatedAt?.seconds || 0;
          return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
        });

        setNotes(notesData);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching notes:', error);
      setLoading(false);
    }
  }, [navigate, sortOrder, user]);

  const handleSort = useCallback(() => {
    setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchVisible(prev => !prev);
    if (isSearchVisible) {
      setSearchTerm('');
    }
  }, [isSearchVisible]);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (category === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && note.category === category;
    }
  });

  // Sample categories - you can replace with actual categories from your notes
  const categories = ['all', 'work', 'personal', 'ideas', 'tasks'];

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen w-full transition-colors duration-300`}>
      {/* Samsung Notes style header */}
      <div className={`fixed top-0 left-0 right-0 z-10 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Notes
          </h1>
          <div className="flex items-center gap-4">
            {isSearchVisible ? (
              <div className="relative w-full max-w-xs animate-fadeIn">
                <input
                  type="text"
                  placeholder="Search notes"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-2 py-1.5 rounded-full ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-800'} focus:outline-none`}
                  autoFocus
                />
                <FaSearch className={`absolute left-3 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            ) : (
              <button 
                onClick={toggleSearch}
                className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaSearch className="text-lg" />
              </button>
            )}
            
            <button 
              onClick={handleSort}
              className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FaSort className="text-lg" />
            </button>
            
            <button className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
              <FaEllipsisV className="text-lg" />
            </button>
          </div>
        </div>
        
        {/* Category tabs - Samsung style */}
        <div className={`flex overflow-x-auto scrollbar-hide ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-200 ${
                category === cat 
                ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-500'}` 
                : `border-transparent ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:${darkMode ? 'text-gray-300' : 'text-gray-800'}`
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 py-3 mt-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className={`text-center py-16 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <div className="flex flex-col items-center gap-4">
              <svg className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h2 className="text-xl font-medium">
                {searchTerm ? 'No matching notes found' : 'No notes'}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} max-w-md`}>
                {searchTerm ? 'Try using different keywords or clear your search' : 'Create a note to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                onClick={() => navigate(`/note/${note.id}`)}
                className={`cursor-pointer p-3 ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} transition-colors duration-200 rounded-lg`}
              >
                <h3 className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-800'} line-clamp-1`}>
                  {note.title || 'Untitled Note'}
                </h3>
                <div className="flex items-center gap-2 mt-1 mb-2">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {note.updatedAt?.seconds ? new Date(note.updatedAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}
                  </span>
                  {note.category && note.category !== 'all' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                      {note.category}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                  {note.content || 'No content'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Samsung Notes style floating action button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate('/new-note')}
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
          aria-label="Create new note"
        >
          <FaPen className="text-xl" />
        </button>
      </div>

      {/* Add styles for animation */}
      <style jsx>{`

      `}</style>
    </div>
  );
};

export default NotesDashboard;