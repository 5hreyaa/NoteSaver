const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const NoteSchema = new mongoose.Schema({
  text: String,
  timestamp: Date,
});

const Note = mongoose.model('Note', NoteSchema);

mongoose.connect('mongodb://localhost:27017/notes-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// POST /notes
app.post('/notes', async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.status(201).send(note);
});

// GET /notes
app.get('/notes', async (req, res) => {
  const notes = await Note.find();
  res.send(notes);
});

// PUT /notes/:id
app.put('/notes/:id', async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(note);
});

// DELETE /notes/:id
app.delete('/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.send({ message: 'Note deleted' });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
