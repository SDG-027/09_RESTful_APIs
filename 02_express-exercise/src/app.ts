import express, { type Request } from 'express';
import mongoose from 'mongoose';

// Typ für den Request-Body beim Erstellen/Aktualisieren eines Posts
type PostRequestBody = {
  title: string;
  content: string;
};

// Verbindung zur MongoDB herstellen. Die URI kommt aus der Umgebungsvariable MONGO_URI.
// dbName legt fest, welche Datenbank innerhalb des MongoDB-Servers verwendet wird.
mongoose.connect(process.env.MONGO_URI!, { dbName: 'posts' });

// Ein Mongoose-Model definiert, wie ein Dokument in der Collection aussieht (Schema).
// Das Model 'Post' bildet auf die Collection 'posts' in MongoDB ab.
const Post = mongoose.model(
  'Post',
  new mongoose.Schema({
    title: String,
    content: String,
  })
);

const app = express();
const port = 3000;

// Middleware: Aktiviert das automatische Parsen von JSON-Request-Bodies.
// Ohne diese Zeile wäre req.body in allen Routen undefined.
app.use(express.json());

app.get('/', (req: Request<{}, {}, PostRequestBody>, res) => {
  const { body } = req;
  console.log(
    `Received request with title: ${body.title} and content: ${body.content}`
  );
});

// -----------------------------------------------------------------------
// CRUD-Routen
// -----------------------------------------------------------------------

// READ ALL – Alle Posts aus der Datenbank abrufen
app.get('/posts', async (req, res) => {
  try {
    // Post.find() ohne Argumente gibt alle Dokumente der Collection zurück
    const posts = await Post.find();
    res.json({ message: 'GET /posts', data: posts });
  } catch {
    console.log(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// CREATE – Einen neuen Post anlegen
app.post('/posts', async (req: Request<{}, {}, PostRequestBody>, res) => {
  // Eingabe validieren: beide Felder müssen vorhanden sein
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Bad request' });
  }
  try {
    // Post.create() legt ein neues Dokument in der Collection an und gibt es zurück
    const newPost = await Post.create(req.body);
    // 201 Created signalisiert, dass eine neue Ressource erfolgreich angelegt wurde
    res.status(201).json({ message: 'success', data: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// READ ONE – Einen einzelnen Post anhand seiner ID abrufen
app.get('/posts/:id', async (req, res) => {
  // :id ist ein URL-Parameter, auf den wir über req.params zugreifen
  const { id } = req.params;

  try {
    // findById sucht das Dokument mit der passenden MongoDB-ObjectId
    const post = await Post.findById(id);

    // null bedeutet: kein Dokument mit dieser ID gefunden → 404 zurückgeben
    if (!post) {
      return res.status(404).json({ message: `Post not found; id : ${id}` });
    }

    res.json({ message: 'GET /posts/:id', data: post });
  } catch (error) {
    console.log(error);

    // CastError wirft mongoose, wenn die übergebene ID kein gültiges ObjectId-Format hat
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
});

// UPDATE – Einen bestehenden Post vollständig ersetzen (PUT)
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Bad request' });
  }

  try {
    // findByIdAndUpdate sucht, aktualisiert und gibt das Dokument zurück.
    // { returnDocument: 'after' } -> aktualisierte Version
    const post = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { returnDocument: 'after' }
    );

    if (!post) {
      return res.status(404).json({ message: `Post not found; id : ${id}` });
    }
    res.json({ message: 'PUT /posts/:id', data: post });
  } catch (error) {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE – Einen Post anhand seiner ID löschen
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // findByIdAndDelete entfernt das Dokument und gibt es zurück (für die Bestätigung)
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: `Post not found; id : ${id}` });
    }

    res.json({ message: 'DELETE /posts/:id', data: post });
  } catch (error) {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
