import type { Product } from "../mocks/data";

const DEFAULT_URL = "https://api.example.com/products";

// Produkte von der REST API abrufen
export async function fetchProducts(
  url: string = DEFAULT_URL
): Promise<Product[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Server-Fehler: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
