import express from 'express';
import initDB from './db/index.ts';
import postsRouter from './routes/posts.routes.ts';

// Hier initialisieren wir die Datenbankverbindung
await initDB();

const app = express();
const port = 3000;

app.use(express.json());

// Nur einfache, spezielle RequestHandler, wie diese Health Router
// können in der Hauptdatei bleiben
app.get('/', (req, res) => {
  res.json({ message: 'Running' });
});

// statt alle Endpunkte hier zu aufzulisten, verwenden wir express.Router(),
// um alle Endpunkte zu sammeln, die mit /posts beginnen
app.use('/posts', postsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
