const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Develop', 'public')));

app.get('/notes', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'Develop', 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes), err => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile(path.join(__dirname, 'Develop', 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== id);
    fs.writeFile(path.join(__dirname, 'Develop', 'db', 'db.json'), JSON.stringify(notes), err => {
      if (err) throw err;
      res.json({ ok: true });
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});