// TypeScript erlaubt es, bestehende Typen aus externen Bibliotheken zu erweitern —
// das nennt sich "Declaration Merging" (Deklarations-Zusammenführung).
// Hier erweitern wir das Request-Interface von Express, das intern von TypeScript
// genutzt wird, um jeden eingehenden HTTP-Request zu typisieren.

declare global {
  // Der `Express`-Namespace ist der offizielle Erweiterungspunkt von Express.
  // Alles, was wir hier deklarieren, gilt global im gesamten Projekt.
  namespace Express {
    // Wir fügen dem vorhandenen Request-Interface eine neue Property hinzu.
    // Express "merged" diese Deklaration automatisch mit seiner eigenen —
    // das Original wird nicht überschrieben, sondern ergänzt.
    interface Request {
      // Das `?` macht die Property optional: Sie muss nicht zwingend gesetzt sein.
      // In der Middleware weisen wir ihr einen Wert zu; hier definieren wir nur den Typ.
      newField?: string;
    }
  }
}

// Das `export {}` macht diese Datei zu einem TypeScript-Modul, was für `declare global` notwendig ist.
export {};
