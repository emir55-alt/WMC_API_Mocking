import ProductList from "./components/ProductList";
import "./App.css";

const SUCCESS_URL = "https://api.example.com/products";
const ERROR_URL = "https://api.example.com/products-error";

export default function App() {
  return (

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
  );
}
