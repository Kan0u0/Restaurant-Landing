import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaTrashAlt, FaEllipsisV, FaImage, FaThumbtack, FaChevronDown } from 'react-icons/fa';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Simple loading component
const Loading = () => (
  <div className="flex items-center justify-center h-32">
    <div className="w-8 h-8 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

// Font options - simplified
const FONT_OPTIONS = [
  { name: 'Default', value: 'font-sans', fontFamily: 'system-ui, sans-serif' },
  { name: 'Arial', value: 'font-arial', fontFamily: 'Arial, sans-serif' },
  { name: 'Georgia', value: 'font-georgia', fontFamily: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'font-times', fontFamily: 'Times New Roman, serif' },
];

// Color palette - simplified
const COLOR_PALETTE = [
  '#ffffff', '#f9e4e4', '#e8f5e9', '#e3f2fd', '#fff9c4', '#ede7f6', '#ffecb3'
];

function NoteEditor({ note: propNote = null, isNew = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const fontMenuRef = useRef(null);
  const pdfExportRef = useRef(null);
  
  // State management
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Note data
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [activeTab, setActiveTab] = useState('text');
  
  // Show notification
  const showNotification = (message) => {
    setError('');
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 2000);
  };

  // Reset form
  const resetForm = () => {
    setNote(null);
    setTitle('');
    setContent('');
    setPinned(false);
    setTags([]);
    setImageUrls([]);
    setIsPublic(false);
    setShareLink('');
    setSelectedColor('#ffffff');
    setSelectedFont(FONT_OPTIONS[0]);
  };
  
  // Load note data
  const loadNote = (noteData) => {
    setNote(noteData);
    setTitle(noteData.title || '');
    setContent(noteData.content || '');
    setPinned(noteData.pinned || false);
    setTags(noteData.tags || []);
    setImageUrls(noteData.imageUrls || []);
    setIsPublic(noteData.isPublic || false);
    setSelectedColor(noteData.color || '#ffffff');
    
    // Set font if available
    if (noteData.font) {
      const fontOption = FONT_OPTIONS.find(f => f.value === noteData.font);
      setSelectedFont(fontOption || FONT_OPTIONS[0]);
    }
    
    // Generate share link if public
    if (noteData.isPublic && noteData.id) {
      setShareLink(`${window.location.origin}/view/note/${noteData.id}`);
    }
  };
  
  // Fetch note
  const fetchNote = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const noteRef = doc(db, 'notes', id);
      const noteSnap = await getDoc(noteRef);
      
      if (!noteSnap.exists()) {
        setError('Note not found');
        setLoading(false);
        return;
      }
      
      const noteData = { id: noteSnap.id, ...noteSnap.data() };
      
      if (noteData.userId !== user.uid) {
        setError('You do not have permission to view this note');
        setLoading(false);
        return;
      }
      
      loadNote(noteData);
    } catch (err) {
      console.error('Error fetching note:', err);
      setError('Failed to load note: ' + err.message);
    }
    setLoading(false);
  };
  
  // Save note
  const handleSave = async () => {
    // Auto-generate title from content if blank
    const finalTitle = title.trim() || 
      (content.trim().split('\n')[0]?.substring(0, 30) || 'Untitled Note');

    if (!finalTitle.trim() && !content.trim() && imageUrls.length === 0) {
      setError('Note cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Create updated note object
      const updatedNote = {
        title: finalTitle,
        content: content.trim(),
        pinned,
        tags,
        imageUrls,
        font: selectedFont.value,
        color: selectedColor,
        isPublic,
        updatedAt: serverTimestamp(),
        userId: user.uid
      };

      let savedNoteId;
      
      if (isNew) {
        updatedNote.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, 'notes'), updatedNote);
        savedNoteId = docRef.id;
      } else {
        await setDoc(doc(db, 'notes', id), updatedNote, { merge: true });
        savedNoteId = id;
      }
      
      // Generate share link if public
      if (isPublic) {
        const shareUrl = `${window.location.origin}/view/note/${savedNoteId}`;
        setShareLink(shareUrl);
        showNotification(`Note saved! Your permanent link is ready.`);
      } else {
        setShareLink('');
        showNotification('Note saved successfully!');
      }
      
      if (isNew && savedNoteId) {
        setTimeout(() => navigate(`/note/${savedNoteId}`), 1000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save note: ' + err.message);
    }
    setLoading(false);
  };
  
  // Delete note
  const handleDelete = async () => {
    if (!id) {
      setError('Cannot delete unsaved note');
      return;
    }
    
    if (window.confirm('Delete this note?')) {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        
        await deleteDoc(doc(db, 'notes', id));
        navigate('/notes');
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete note: ' + err.message);
      }
      setLoading(false);
    }
  };

  // Toggle public/private status
  const togglePublic = () => {
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);
    
    if (newIsPublic) {
      const noteId = id;
      if (noteId) {
        setShareLink(`${window.location.origin}/view/note/${noteId}`);
      }
    } else {
      setShareLink('');
    }
  };

  // Upload image
  const uploadImage = (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrls(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError(`Error uploading image: ${error.message}`);
    }
  };

  // Export to PDF
  const handleExportPDF = async () => {
    if (!pdfExportRef.current) return;
    
    setLoading(true);
    try {
      const canvas = await html2canvas(pdfExportRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${title || 'note'}.pdf`);
      
      showNotification("PDF exported successfully!");
    } catch (err) {
      console.error('PDF export error:', err);
      setError('Failed to export PDF: ' + err.message);
    }
    setLoading(false);
  };

  // Tag management
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Copy share link
  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
        .then(() => showNotification('Link copied to clipboard!'))
        .catch(err => setError('Could not copy link: ' + err.message));
    }
  };

  // Load note data on component mount
  useEffect(() => {
    if (isNew) {
      resetForm();
    } else if (propNote) {
      loadNote(propNote);
    } else if (id) {
      fetchNote();
    }
  }, [id, isNew, propNote]);
  
  // Close font menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target)) {
        setShowFontMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Loading state
  if (loading && !isNew && !note) return <Loading />;

  // Font selection component
  const FontSelectionUI = () => (
    <div className="relative" ref={fontMenuRef}>
      <button 
        onClick={() => setShowFontMenu(!showFontMenu)}
        className="flex items-center px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
      >
        <span className="mr-2" style={{ fontFamily: selectedFont.fontFamily }}>
          {selectedFont.name}
        </span>
        <FaChevronDown size={12} />
      </button>
      
      {showFontMenu && (
        <div className="absolute z-10 mt-1 w-48 bg-white border rounded-md shadow-lg max-h-64 overflow-y-auto">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.value}
              onClick={() => {
                setSelectedFont(font);
                setShowFontMenu(false);
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                selectedFont.value === font.value ? 'bg-blue-50 text-blue-600' : ''
              }`}
              style={{ fontFamily: font.fontFamily }}
            >
              {font.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Color picker component
  const ColorPickerUI = () => (
    <div className="mt-2 p-2 border-t border-gray-200">
      <div className="flex justify-center space-x-2">
        {COLOR_PALETTE.map(color => (
          <button
            key={color}
            onClick={() => {
              setSelectedColor(color);
              setShowColorPicker(false);
            }}
            className={`w-6 h-6 rounded-full focus:outline-none ${
              selectedColor === color ? 'ring-2 ring-blue-500' : 'border border-gray-300'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );

  // Image upload component
  const ImageUploadUI = () => (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) uploadImage(file);
        }}
        accept="image/*"
        className="hidden"
      />
      <FaImage className="mx-auto text-4xl text-gray-400 mb-3" />
      <p className="mb-2 text-gray-600">Drag an image or</p>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Upload Image
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white" style={{ backgroundColor: selectedColor }}>
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 mr-2 text-gray-600 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft size={16} />
          </button>
          <span className="text-lg font-medium truncate">
            {isNew ? 'New note' : title || 'Untitled'}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setPinned(!pinned)}
            className={`p-2 rounded-full hover:bg-gray-100 ${pinned ? 'text-yellow-500' : 'text-gray-600'}`}
            title={pinned ? 'Unpin note' : 'Pin note'}
          >
            <FaThumbtack size={16} />
          </button>
          <button 
            onClick={togglePublic}
            className={`p-2 rounded-full hover:bg-gray-100 ${isPublic ? 'text-blue-500' : 'text-gray-600'}`}
            title={isPublic ? 'Make private' : 'Make public'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isPublic ? 
                "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : 
                "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"}>
              </path>
            </svg>
          </button>
          <button 
            onClick={handleSave}
            className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
          >
            <FaSave size={16} />
          </button>
          {!isNew && id && (
            <button 
              onClick={handleDelete}
              className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
            >
              <FaTrashAlt size={16} />
            </button>
          )}
          <button 
            onClick={handleExportPDF}
            className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
            title="Export as PDF"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </button>
          <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
            <FaEllipsisV size={16} />
          </button>
        </div>
      </div>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <Loading />
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="m-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Success message */}
      {saveMessage && (
        <div className="m-4 p-3 bg-green-50 text-green-700 rounded-md">
          {saveMessage}
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 p-4 overflow-auto" ref={pdfExportRef}>
        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full mb-4 text-2xl font-bold border-none focus:outline-none bg-transparent"
          style={{ fontFamily: selectedFont.fontFamily }}
        />
        
        {/* Formatting toolbar */}
        <div className="flex flex-wrap items-center mb-4 space-x-2">
          <FontSelectionUI />
          
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50 flex items-center"
            title="Change background color"
          >
            <div 
              className="w-4 h-4 mr-2 rounded-full border border-gray-300" 
              style={{ backgroundColor: selectedColor }}
            />
            <span>Color</span>
          </button>
          
          {showColorPicker && <ColorPickerUI />}
        </div>
        
        {/* Tabs - Text and Images */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 ${activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Text
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 ${activeTab === 'images' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Images
          </button>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'text' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
            className="w-full h-64 border-none focus:outline-none bg-transparent resize-none"
            style={{ fontFamily: selectedFont.fontFamily }}
          />
        ) : (
          <div className="space-y-4">
            {imageUrls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Note image ${index + 1}`} 
                      className="w-full h-auto rounded-lg shadow-sm" 
                    />
                    <button
                      onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-red-500 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <ImageUploadUI />
          </div>
        )}
        
        {/* Tags section */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                <span className="text-sm">{tag}</span>
                <button 
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add tags..."
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={addTag}
              className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Share link section */}
        {isPublic && shareLink && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-blue-700 mb-2 sm:mb-0">
                <span className="font-medium">Share link:</span>
                <span className="ml-2 text-sm truncate">{shareLink}</span>
              </div>
              <button
                onClick={copyShareLink}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteEditor;