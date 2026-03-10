import { useState, useEffect, useCallback } from "react";
import { fetchProducts } from "../api/fetchProducts";
import type { Product } from "../mocks/data";

interface ProductListProps {
  url?: string;
}

export default function ProductList({ url }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProducts([]);

    try {
      const data = await fetchProducts(url);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return <div className="status loading">Produkte werden geladen...</div>;
  }

  if (error) {
    return (
      <div className="status error" role="alert">
        <h3>Fehler beim Laden der Produkte</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="status empty">Keine Produkte gefunden.</div>;
  }

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Preis</th>
            <th>Kategorie</th>
            <th>Verfügbar</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price.toFixed(2)} €</td>
              <td>{product.category}</td>
              <td className={product.inStock ? "in-stock" : "out-of-stock"}>
                {product.inStock ? "Auf Lager" : "Nicht verfügbar"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
