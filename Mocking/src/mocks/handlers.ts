import { http, HttpResponse } from "msw";
import { fakeProducts } from "./data";

// Beide Handler laufen gleichzeitig – zwei verschiedene Endpoints
export const handlers = [
  // Erfolgreicher Endpoint – gibt Fake-Produktdaten zurück
  http.get("https://api.example.com/products", () => {
    return HttpResponse.json(fakeProducts, { status: 200 });
  }),

  // Fehler-Endpoint – simuliert 500 Internal Server Error
  //überflüssig nur App.tsx ruft es auf um Fehlerfall anzuzeigen 
  //nicht im richtigen Test verwendet
  http.get("https://api.example.com/products-error", () => {
    return HttpResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }),
];

// Einzelner Fehler-Handler für Tests via server.use()
// Überschreibt den Erfolgs-Endpoint temporär mit 500
export const errorHandler = http.get(
  "https://api.example.com/products",
  () => {
    return HttpResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
);
