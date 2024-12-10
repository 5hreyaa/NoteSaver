import React, { useState, useEffect } from 'react';
import { addNote, getNotes, deleteNote, updateNote } from './idb';
import './App.css';
function App() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const savedNotes = await getNotes();
    setNotes(savedNotes);
  };

  const handleAddNote = async () => {
    if (noteText.trim() === '') return;

    const newNote = { text: noteText, timestamp: new Date().toISOString() };
    await addNote(newNote);
    setNoteText('');
    loadNotes(); // Reload notes
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    loadNotes(); // Reload notes
  };

  const handleEditNote = (note) => {
    setNoteText(note.text);
    setIsEditing(true);
    setCurrentNote(note);
  };

  const handleUpdateNote = async () => {
    const updatedNote = { ...currentNote, text: noteText };
    await updateNote(updatedNote);
    setNoteText('');
    setIsEditing(false);
    setCurrentNote(null);
    loadNotes(); // Reload notes
  };

  const handleDownloadNotes = async (all = false) => {
    let notesData;
    if (all) {
      notesData = await getNotes(); // Get all notes
    } else {
      notesData = notes.filter(note => note.selected); // Filter selected notes
    }
    
    const blob = new Blob([JSON.stringify(notesData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.json'; // Download file name
    a.click();
    URL.revokeObjectURL(url);
    setDownloadModalVisible(false); // Close the modal after download
  };

  const toggleNoteSelection = (id) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) =>
        note.id === id ? { ...note, selected: !note.selected } : note
      )
    );
  };

  return (
    <div className="App">
      <h1>My Notes</h1>

      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="What's on your mind"
      ></textarea>
      <button onClick={isEditing ? handleUpdateNote : handleAddNote}>
        {isEditing ? 'Update Note' : 'Add Note'}
      </button>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <input
              type="checkbox"
              checked={note.selected || false}
              onChange={() => toggleNoteSelection(note.id)}
            />
            <p className="note-text">{note.text}</p>
            <div>
              <button className="edit-button" onClick={() => handleEditNote(note)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteNote(note.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={() => setDownloadModalVisible(true)}>
        Download Notes
      </button>

      {downloadModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Download Options</h2>
            <button onClick={() => handleDownloadNotes(true)}>Download All Notes</button>
            <button onClick={() => handleDownloadNotes(false)}>Download Selected Notes</button>
            <button onClick={() => setDownloadModalVisible(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
