import type { ErrorRequestHandler } from 'express';

// ErrorRequestHandler ist der Express-Typ für Error-Handling-Middleware.
// Er erzwingt die Signatur mit 4 Parametern: (err, req, res, next).
// Genau diese 4 Parameter sind das Signal für Express, die Funktion als
// Error-Handler zu erkennen — nicht als normale Middleware.
const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  // Standardwerte für den Fall, dass wir den Fehler nicht genauer einordnen können.
  let errorMessage = 'Internal server error';
  let statusCode = 500;

  // Wir prüfen, ob es sich um ein echtes Error-Objekt handelt, bevor wir
  // auf seine Properties zugreifen — TypeScript und Laufzeit-Sicherheit in einem.
  if (error instanceof Error) {
    // Das `cause`-Objekt ist ein optionales Feld, das wir beim Werfen des Fehlers
    // selbst befüllen können: `throw new Error('...', { cause: { status: 404 } })`.
    // Hier lesen wir den HTTP-Statuscode daraus aus, falls vorhanden.
    if (error.cause && typeof error.cause === 'object' && 'status' in error.cause) {
      statusCode = error.cause.status as number;
    }
    errorMessage = error.message;

    // CastError ist ein Mongoose-spezifischer Fehler, der entsteht, wenn eine
    // übergebene ID kein gültiges MongoDB-ObjectId-Format hat.
    // Wir mappen ihn auf einen sprechenden 400-Fehler statt einem generischen 500.
    if (error.name === 'CastError') {
      statusCode = 400;
      errorMessage = 'Invalid Id';
    }
  }

  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;
