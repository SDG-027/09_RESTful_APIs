import type { RequestHandler } from 'express';
import z, { ZodObject } from 'zod';

// validate() ist eine Middleware-Factory: Sie nimmt ein Zod-Schema entgegen
// und gibt eine fertige Express-Middleware-Funktion zurück.
// So kann man für jede Route ein eigenes Schema übergeben, z.B.:
//   router.post('/users', validate(userSchema), createUser)
function validate(schema: ZodObject): RequestHandler {
  // Die zurückgegebene Funktion ist die eigentliche Middleware.
  // Express ruft sie automatisch mit (req, res, next) auf.
  return (req, res, next) => {
    // safeParse() validiert die Daten gegen das Schema
    const { success, data, error } = schema.safeParse(req.body);

    if (!success) {
      // z.prettifyError() wandelt den technischen Zod-Fehler in einen
      // lesbaren Text um — praktisch für Fehlermeldungen in der API-Antwort.
      // const errMessage = z.prettifyError(error);

      // Wir werfen einen Error mit einem cause-Objekt.
      // Das cause-Objekt trägt den HTTP-Statuscode 400 (Bad Request),
      // den unser globaler Error-Handler später auslesen und an den Client senden kann.
      // throw new Error(errMessage, { cause: { status: 400 } });
      //

      const issues = error.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message
      }));

      return res.status(400).json({ issues, message: 'Validation failed' });
    }

    // Wenn die Validierung erfolgreich war, überschreiben wir req.body mit den
    // geparsten Daten. Zod bereinigt dabei automatisch unbekannte Felder
    // und wandelt Typen um (z.B. Strings zu Zahlen), wenn das Schema es vorschreibt.
    req.body = data;

    // next() übergibt die Kontrolle an den nächsten Middleware- oder Route-Handler.
    next();
  };
}

export default validate;
