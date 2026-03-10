import ProductList from "./components/ProductList";
import "./App.css";

const SUCCESS_URL = "https://api.example.com/products";
const ERROR_URL = "https://api.example.com/products-error";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>API-Mocking mit MSW</h1>
        <p className="subtitle">
          Gruppe 3: Die Netzwerkgrenze – Mock Service Worker Demo
        </p>
      </header>

      <section className="explanation">
        <h2>Was ist Mock Service Worker (MSW)?</h2>
        <p>
          MSW fängt Netzwerkanfragen auf der{" "}
          <strong>Service-Worker-Ebene</strong> ab. Der{" "}
          <code>fetch()</code>-Aufruf im Code bleibt unverändert – MSW ersetzt
          nur die Antwort. Dadurch laufen Tests schnell und zuverlässig, ohne
          eine echte Backend-API oder Datenbank.
        </p>
      </section>

      <div className="scenarios">
        <section className="scenario">
          <h2>Erfolg (200 OK)</h2>
          <p className="info-success">
            MSW gibt Fake-Produktdaten zurück. Die Komponente zeigt sie an.
          </p>
          <div className="result-container">
            <ProductList url={SUCCESS_URL} />
          </div>
        </section>

        <section className="scenario">
          <h2>Server-Fehler (500)</h2>
          <p className="info-error">
            MSW gibt einen <code>500 Internal Server Error</code> zurück.
            Die Komponente erkennt den Fehler und zeigt eine Fehlermeldung.
          </p>
          <div className="result-container">
            <ProductList url={ERROR_URL} />
          </div>
        </section>
      </div>

      <section className="code-overview">
        <h2>So funktioniert es</h2>

        <div className="code-block">
          <h3>1. Handler definieren (handlers.ts)</h3>
          <pre>
            <code>{`import { http, HttpResponse } from "msw";

// Erfolg – gibt Fake-Produktdaten zurück
http.get("https://api.example.com/products", () => {
  return HttpResponse.json(fakeProducts, { status: 200 });
});

// Fehler – simuliert 500 Internal Server Error
http.get("https://api.example.com/products-error", () => {
  return HttpResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
});`}</code>
          </pre>
        </div>

        <div className="code-block">
          <h3>2. Worker/Server einrichten</h3>
          <pre>
            <code>{`// Browser (browser.ts)
import { setupWorker } from "msw/browser";
export const worker = setupWorker(...handlers);

// Node.js Tests (server.ts)
import { setupServer } from "msw/node";
export const server = setupServer(...handlers);`}</code>
          </pre>
        </div>

        <div className="code-block">
          <h3>3. Test: Erfolg vs. Fehler</h3>
          <pre>
            <code>{`test("zeigt Produkte bei erfolgreicher Antwort", async () => {
  render(<ProductList />);
  const rows = await screen.findAllByRole("row");
  expect(rows).toHaveLength(6); // Header + 5 Produkte
});

test("zeigt Fehlermeldung bei 500 Error", async () => {
  server.use(errorHandler); // Handler überschreiben
  render(<ProductList />);
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("Server-Fehler: 500");
});`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
