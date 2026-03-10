export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// Fake-Produktdaten für den Mock-Handler
export const fakeProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Kopfhörer",
    price: 59.99,
    category: "Elektronik",
    inStock: true,
  },
  {
    id: 2,
    name: "Ergonomische Tastatur",
    price: 89.99,
    category: "Elektronik",
    inStock: true,
  },
  {
    id: 3,
    name: "USB-C Hub 7-in-1",
    price: 34.99,
    category: "Zubehör",
    inStock: false,
  },
  {
    id: 4,
    name: "LED Schreibtischlampe",
    price: 29.99,
    category: "Büro",
    inStock: true,
  },
  {
    id: 5,
    name: "Notebook-Ständer Aluminium",
    price: 45.99,
    category: "Zubehör",
    inStock: true,
  },
];
