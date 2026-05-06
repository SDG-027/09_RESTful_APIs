import express from 'express';
import initDB from '#db';
import { postRouter, userRouter } from '#routers';
import { errorHandler } from '#middlewares';

await initDB();

const app = express();
const port = process.env.PORT || 8080;

// Eingebaute Express-Middleware: Liest den Request-Body als JSON ein
// und macht ihn als JavaScript-Objekt unter `request.body` verfügbar.
// Ohne diese Zeile wäre `request.body` immer `undefined`.
app.use(express.json());

// app.use() ohne Pfad registriert eine Middleware für *alle* Routen.
// Express führt Middleware in der Reihenfolge aus, in der sie registriert werden.
app.use((request, response, next) => {
  console.log(request.body);
  console.log(request.method);
  console.log(request.url);

  // Middlewares können das Request-Objekt erweitern, um Daten
  // an nachfolgende Middlewares oder Route-Handler weiterzugeben.
  request.newField = 'Hallo';

  console.log('Hallo aus der Middleware');

  // next() übergibt die Kontrolle an die nächste Middleware in der Kette.
  // Wird next() NICHT aufgerufen, bleibt der Request hier "hängen"
  // und der Client erhält keine Antwort.
  next();
});

// Router-Middlewares: Alle Anfragen an '/users' bzw. '/posts'
// werden an den jeweiligen Sub-Router weitergeleitet.
app.use('/users', userRouter);
app.use('/posts', postRouter);

// Catch-all für alle nicht gematchten Routen.
// Der Wildcard-Pattern '*splat' greift, wenn keine vorherige Route passt.
// Hier werfen wir einen Fehler mit einem `cause`-Objekt, das den HTTP-Status trägt.
app.use('*splat', (req, res) => {
  throw new Error(`Not found | Cannot ${req.method} ${req.url}`, { cause: { status: 404 } });
});

// Error-Handling-Middleware: Muss als LETZTES registriert werden.
// Express erkennt sie daran, dass sie 4 Parameter hat: (err, req, res, next).
// Alle Fehler aus vorherigen Middlewares und Routen landen hier.
app.use(errorHandler);

app.listen(port, () => console.log(`\x1b[34mMain app listening on port: ${port}\x1b[0m`));
