import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import axios from 'axios';

const NewNotesForm = () => {
  const navigate = useNavigate();
  const [note, setNote] = useState({ 
    title: '', content: '', tags: [], color: '#ffffff'
  });
  const [status, setStatus] = useState({
    error: '', saving: false, showToolbar: false, toolbarType: 'text',
    pinned: false, isPublic: false, shareLink: '', savedNoteId: null
  });
  const [tagInput, setTagInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  
  // Constants
  const colorPalette = ['#ffffff', '#e9f0f8', '#dcedc8', '#e1f5fe', '#fff9c4', '#e0e0e0', '#d1c4e9', '#bbdefb'];
  const textStyles = [
    { name: 'Title', class: 'text-2xl font-bold' },
    { name: 'Heading', class: 'text-xl font-semibold' },
    { name: 'Subheading', class: 'text-lg font-medium' },
    { name: 'Body', class: 'text-base' },
    { name: 'Small', class: 'text-sm' }
  ];

  // Check authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => !user && navigate('/signin'));
    return () => unsubscribe();
  }, [navigate]);

  // Helper functions
  const toggleToolbar = (type) => {
    setStatus(s => ({ 
      ...s, 
      showToolbar: s.toolbarType !== type || !s.showToolbar, 
      toolbarType: type 
    }));
  };

  const togglePublic = () => {
    setStatus(s => ({ 
      ...s, 
      isPublic: !s.isPublic, 
      shareLink: !s.isPublic ? `${window.location.origin}/view/note/temp-${Date.now()}` : '' 
    }));
  };

  const showNotification = (message) => {
    setStatus(s => ({ ...s, error: '', saving: false }));
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-md z-50';
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Image handlers
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'notes_app');
      
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', 
        formData
      );
      
      setImageUrls(prev => [...prev, response.data.secure_url]);
    } catch (error) {
      setStatus(s => ({ ...s, error: `Error uploading image: ${error.message}` }));
    }
  };

  const removeImage = (indexToRemove) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Tag handlers
  const addTag = () => {
    if (tagInput.trim() && !note.tags.includes(tagInput.trim())) {
      setNote(n => ({ ...n, tags: [...n.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNote(n => ({ ...n, tags: n.tags.filter(tag => tag !== tagToRemove) }));
  };

  // Main actions
  const handleSave = async () => {
    const finalTitle = note.title.trim() || 
      (note.content.trim().split('\n')[0]?.substring(0, 30) || 'Untitled Note');
    
    try {
      setStatus(s => ({ ...s, saving: true }));
      const user = auth.currentUser;
      
      if (!user) {
        navigate('/signin');
        return;
      }
      
      // Create note document
      const docRef = await addDoc(collection(db, 'notes'), {
        title: finalTitle,
        content: note.content,
        tags: note.tags,
        color: note.color,
        pinned: status.pinned,
        isPublic: status.isPublic,
        imageUrls,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const noteId = docRef.id;
      setStatus(s => ({ ...s, savedNoteId: noteId }));
      
      if (status.isPublic) {
        const permalinkUrl = `${window.location.origin}/view/note/${noteId}`;
        setStatus(s => ({ ...s, shareLink: permalinkUrl }));
        showNotification('Note saved! Your permanent link is ready.');
      } else {
        showNotification("Note saved successfully!");
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      console.error("Error creating note:", err);
      setStatus(s => ({ 
        ...s, error: 'Error creating note: ' + err.message, saving: false 
      }));
    }
  };

  const copyShareLink = () => {
    if (status.shareLink) {
      navigator.clipboard.writeText(status.shareLink)
        .then(() => showNotification('Link copied to clipboard!'))
        .catch(err => setStatus(s => ({ 
          ...s, error: 'Could not copy link: ' + err.message 
        })));
    }
  };

  // Feature placeholders
  const featureNotImplemented = (name) => showNotification(`${name} feature will be implemented soon`);
  const addDrawing = () => featureNotImplemented("Drawing");
  const addVoiceRecording = () => featureNotImplemented("Voice recording");
  const capturePhoto = () => featureNotImplemented("Camera capture");
  const handleExportPDF = () => featureNotImplemented("PDF export");

  // UI Components
  const ToolbarButton = ({ onClick, active, title, icon, colorIndicator }) => (
    <button
      onClick={onClick}
      className={`p-2 ${active ? 'text-blue-600' : 'text-gray-600'} hover:bg-gray-100 rounded-full relative`}
      title={title}
    >
      {icon}
      {colorIndicator && (
        <div 
          className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-gray-300"
          style={{ backgroundColor: note.color }}
        ></div>
      )}
    </button>
  );

  const ActionButton = ({ onClick, active, icon, label }) => (
    <button onClick={onClick} className="flex flex-col items-center p-2">
      <div className={`w-10 h-10 rounded-full ${
        active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
      } flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f1f5f9' }}>
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} className="mr-4 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="bg-transparent border-none focus:ring-0 text-lg font-medium placeholder-blue-200 text-white w-full"
            placeholder="Note title"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setStatus(s => ({ ...s, pinned: !s.pinned }))}
            className={`p-2 rounded-full ${status.pinned ? 'text-yellow-300' : 'text-blue-200'}`}
            title={status.pinned ? 'Unpin note' : 'Pin note'}
          >
            <svg className="w-5 h-5" fill={status.pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
          </button>
          <button 
            onClick={handleSave} 
            disabled={status.saving} 
            className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium" 
          >
            {status.saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Error message */}
      {status.error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{status.error}</p>
        </div>
      )}

      {/* Share link display */}
      {status.shareLink && (
        <div className="bg-blue-50 p-4 flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="font-medium text-blue-800 mb-1">
              {status.saving ? 'Saving public note...' : 
                status.shareLink.includes('temp-') ? 'Preview link (save to get permanent URL):' : 'Permanent public link:'}
            </p>
            <p className="text-blue-600 text-sm truncate">{status.shareLink}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={copyShareLink} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Copy
            </button>
            {status.shareLink.includes('temp-') ? (
              <button 
                onClick={handleSave} 
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" 
                disabled={status.saving}
              >
                {status.saving ? 'Saving...' : 'Save Now'}
              </button>
            ) : (
              <button 
                onClick={() => navigate(`/view/note/${status.savedNoteId}`)} 
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" 
                disabled={!status.savedNoteId}
              >
                View Note
              </button>
            )}
          </div>
        </div>
      )}

      {/* Note content area */}
      <div className="flex-grow p-4" style={{ backgroundColor: note.color }}>
        <textarea
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          className="w-full h-full p-3 resize-none focus:outline-none focus:ring-0 border-none rounded shadow-sm"
          style={{ backgroundColor: 'transparent', minHeight: '60vh' }}
          placeholder="Start writing..."
        />
        
        {/* Images display */}
        {imageUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-32 object-cover rounded shadow" 
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main toolbar */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex justify-between items-center px-2 py-1">
          {/* Left toolbar buttons */}
          <div className="flex space-x-1">
            {/* Text format button */}
            <ToolbarButton 
              onClick={() => toggleToolbar('text')}
              active={status.showToolbar && status.toolbarType === 'text'}
              title="Text formatting"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              }
            />
            
            {/* Drawing tool button */}
            <ToolbarButton 
              onClick={addDrawing}
              title="Draw"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              }
            />
            
            {/* Voice recording button */}
            <ToolbarButton 
              onClick={addVoiceRecording}
              title="Voice recording"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              }
            />
            
            {/* Media button */}
            <ToolbarButton 
              onClick={() => toggleToolbar('media')}
              active={status.showToolbar && status.toolbarType === 'media'}
              title="Add media"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              }
            />
            
            {/* Color picker button */}
            <ToolbarButton 
              onClick={() => toggleToolbar('color')}
              active={status.showToolbar && status.toolbarType === 'color'}
              title="Change note color"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4l2 2h4a2 2 0 012 2v3.5"></path>
                </svg>
              }
              colorIndicator={true}
            />
            
            {/* More options button */}
            <ToolbarButton 
              onClick={() => toggleToolbar('more')}
              active={status.showToolbar && status.toolbarType === 'more'}
              title="More options"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
              }
            />
          </div>
          
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={status.saving}
            className={`px-4 py-2 text-white rounded-full ${
              status.saving ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {status.saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        
        {/* Secondary toolbars */}
        {status.showToolbar && status.toolbarType === 'text' && (
          <div className="p-2 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {textStyles.map((style, idx) => (
                <button
                  key={idx}
                  className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Media toolbar */}
        {status.showToolbar && status.toolbarType === 'media' && (
          <div className="p-2 border-t border-gray-200">
            <div className="flex justify-start space-x-4">
              <div>
                <label htmlFor="imageInput" className="flex flex-col items-center cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <span className="text-xs mt-1">Gallery</span>
                </label>
                <input 
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                  className="hidden"
                />
              </div>
              
              <button onClick={capturePhoto} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <span className="text-xs mt-1">Camera</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Color picker */}
        {status.showToolbar && status.toolbarType === 'color' && (
          <div className="p-2 border-t border-gray-200">
            <div className="flex justify-start space-x-2">
              {colorPalette.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setNote({...note, color});
                    setStatus(s => ({ ...s, showToolbar: false }));
                  }}
                  className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* More options toolbar */}
        {status.showToolbar && status.toolbarType === 'more' && (
          <div className="p-2 border-t border-gray-200">
            <div className="grid grid-cols-4 gap-2">
              <ActionButton 
                onClick={togglePublic}
                active={status.isPublic}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={status.isPublic ? 
                      "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : 
                      "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"}>
                    </path>
                  </svg>
                }
                label={status.isPublic ? 'Public' : 'Private'}
              />
              
              <ActionButton 
                onClick={handleExportPDF}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                }
                label="Export PDF"
              />
              
              <ActionButton 
                onClick={() => document.getElementById('tagInput')?.focus()}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5a1.99 1.99 0 013.411 1.393l6.178 14.542c.16.378.139.847-.055 1.255-.195.408-.565.809-1.078.809H7c-.513 0-.883-.401-1.078-.809-.194-.408-.215-.877-.055-1.255L6.99 4.393A2 2 0 017 3z"></path>
                  </svg>
                }
                label="Tags"
              />
              
              <ActionButton 
                onClick={() => setStatus(s => ({ ...s, pinned: !s.pinned }))}
                active={status.pinned}
                icon={
                  <svg className="w-6 h-6" fill={status.pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                }
                label={status.pinned ? 'Unpin' : 'Pin'}
              />
            </div>
          </div>
        )}
        
        {/* Tags section */}
        {(note.tags.length > 0 || tagInput) && (
          <div className="p-2 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              {note.tags.map((tag, index) => (
                <div key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center">
                  <span>{tag}</span>
                  <button onClick={() => removeTag(tag)} className="ml-1 text-blue-500 hover:text-blue-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
              <div className="flex items-center">
                <input
                  id="tagInput"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="border-none bg-gray-100 rounded-l px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add tag..."
                />
                <button
                  onClick={addTag}
                  className="bg-blue-500 text-white rounded-r px-2 py-1 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewNotesForm;