import express from 'express';

// express() erstellt die App-Instanz — das zentrale Objekt, über das wir
// Routen registrieren, Middleware einbinden und den Server starten.
const app = express();

// Platzhalter für eine echte Datenbank
const fakeDB = [
  { _id: 's938rz928z9', name: 'macBook neo' },
  { _id: '3984572953u2', name: 'Ronja Räubertochter' },
];

// Middleware: express.json() liest den Request-Body ein und parst ihn als JSON.
// Ohne diese Zeile wäre req.body in POST/PUT-Routen undefined.
// app.use() registriert Middleware global — sie läuft bei *jeder* Anfrage.
app.use(express.json());

// app.get() registriert eine Route, die nur auf GET-Anfragen an '/' reagiert.
// Express übernimmt das Routing — kein manuelles if(method === 'GET') mehr nötig.
app.get('/', (request, response) => {
  console.log('root');

  // status() und send() können separat aufgerufen werden ...
  response.status(418);
  response.send('Hello, World');
});

app.get('/products', (req, res) => {
  const products = fakeDB;

  // res.json() setzt automatisch Content-Type: application/json
  // und serialisiert das Objekt — kein JSON.stringify() nötig.
  res.json(products);
});

app.post('/products', (req, res) => {
  // req.body enthält den geparsten JSON-Body der Anfrage.
  // Das funktioniert nur, weil wir oben express.json() eingebunden haben.
  console.log(req.body);
  const newProduct = { ...req.body, _id: '9837402952' };

  fakeDB.push(newProduct);

  // Die response lässt sich per Method Chaining in einer Zeile konfigurieren.
  // 201 = Created: Die Ressource wurde erfolgreich angelegt.
  res.status(201).json({ message: 'Product Created', data: newProduct });
});

// :id ist ein URL-Parameter — ein Platzhalter für einen dynamischen Wert.
// /products/abc und /products/123 matchen beide diese Route.
app.get('/products/:id', (req, res) => {
  // req.params enthält alle URL-Parameter als Objekt: { id: 'abc' }
  const { id } = req.params;

  res.json({ message: 'Success', data: id });
});

// Startet den Server — analog zu http.listen() vorhin, aber über Express.
app.listen(3210);
