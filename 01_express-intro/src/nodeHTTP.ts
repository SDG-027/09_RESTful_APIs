// Node.js bringt ein eingebautes 'http'-Modul mit — kein npm-Paket nötig.
// Das Präfix 'node:' macht explizit, dass es sich um ein Core-Modul handelt.
import http from 'node:http';

// createServer() nimmt eine Callback-Funktion entgegen, die bei *jeder* eingehenden
// Anfrage ausgeführt wird — egal welche URL oder Methode.
// Node.js nennt diesen Callback einen "Request Listener".
http
  .createServer((request, response) => {
    console.log('Programm läuft');

    // Das 'request'-Objekt enthält alle Infos zur eingehenden Anfrage.
    // Wir lesen die HTTP-Methode (GET, POST, …) und den Pfad (/products, /books, …) aus.
    const method = request.method;
    const url = request.url;

    // console.log(response);

    // Manuelles Routing: Wir prüfen selbst jede Kombination aus Methode + URL.
    // Das wird schnell unübersichtlich — genau deshalb gibt es später Express.
    if (method === 'GET' && url === '/products') {
      console.log('Handle Products request');
    }
    if (method === 'POST' && url === '/products') {
      console.log('Create new Product');

      try {
        console.log('Eintrag in die DB');

        // Hier wird absichtlich ein Fehler geworfen, um den catch-Block zu demonstrieren.
        // In einer echten App würde hier z. B. die Datenbankoperation fehlschlagen.
        throw new Error('invalid Product');

        // der Erfolgsfall hier  als Referenz.
        response.writeHead(201, {});
        response.end();
      } catch {
        // writeHead() setzt den HTTP-Statuscode und die Response-Header.
        // 400 = Bad Request: Der Client hat etwas Ungültiges geschickt.
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        // response.writeHead(400, { 'Content-Type': 'application/json' });

        // response.end() sendet den Body und schließt die Verbindung.
        // Ohne end() würde der Browser ewig auf eine Antwort warten.
        response.end('Product Invalid');
      }
    }
    if (method === 'GET' && url === '/books') {
      console.log('Handle Books request');

      // response.statusCode = 200; //

      // 404 = Not Found: Die angefragte Ressource existiert (noch) nicht.
      // Achtung: Der Content-Type ist 'text/plain', also wird das HTML-Tag
      // als reiner Text ausgegeben — kein Rendering durch den Browser.
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('<h1>There are no Books found</h1>');
    }
  })
  // listen() startet den Server und hält das Programm am Laufen.
  // Intern läuft ein Event-Loop — Node.js wartet ständig auf neue Anfragen,
  // ähnlich wie eine while(true)-Schleife, nur ohne CPU zu blockieren.
  .listen(3210); // http://localhost:3210
