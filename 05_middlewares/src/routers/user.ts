import { Router } from 'express';
import * as c from '#controllers';
import { logUserId } from '#middlewares';

const userRouter = Router();

// Router-level Middleware: gilt für ALLE Routen in diesem Router.
// Sie wird vor jedem Route-Handler ausgeführt, der weiter unten registriert ist.
userRouter.use((req, res, next) => {
  console.log('Hit user router');

  // req.newField wurde in der globalen Middleware (app.use) gesetzt und
  // in der Declaration-Merging-Datei typisiert — hier lesen wir sie aus.
  console.log('Aus req.newField', req.newField);

  // Middlewares können den Request auch frühzeitig abbrechen, ohne next() zu rufen.
  // Hier antworten wir mit 50% Wahrscheinlichkeit sofort mit einem Fehler —
  // die nachfolgenden Route-Handler werden in diesem Fall nie erreicht.
  if (Math.random() < 0.5) {
    return res.status(418).json({ message: 'Pech gehabt' });
  }

  next();
});

userRouter.get('/', c.getUsers);
userRouter.post('/', c.createUser);

// Route-level Middleware: gilt nur für diesen einen Endpunkt.
// Express akzeptiert nach Pfad beliebig viele Middleware-Funktionen als weitere Argumente.
// Sie werden der Reihe nach ausgeführt — erst logUserId, dann getUserById.
userRouter.get(
  '/:id',
  // Middleware
  logUserId,
  c.getUserById // Controller
);

userRouter.put('/:id', c.updateUser);

// Middlewares können einfach wiederverwendet werden.
userRouter.delete('/:id', logUserId, c.deleteUser);

export default userRouter;
