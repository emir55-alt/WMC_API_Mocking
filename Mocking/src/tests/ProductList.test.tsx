import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ProductList from "../components/ProductList";
import { server } from "../mocks/server";
import { errorHandler } from "../mocks/handlers";
import { fakeProducts } from "../mocks/data";

describe("ProductList", () => {
  test("zeigt Ladeindikator während des Fetch", () => {
    render(<ProductList />);
    expect(screen.getByText("Produkte werden geladen...")).toBeInTheDocument();
  });

  test("zeigt Produkte bei erfolgreicher API-Antwort", async () => {
    render(<ProductList />);

    // Warten bis die Tabelle gerendert ist
    const rows = await screen.findAllByRole("row");
    // 1 Header-Zeile + 5 Produkt-Zeilen
    expect(rows).toHaveLength(6);

    // Prüfen ob alle Produktnamen angezeigt werden
    for (const product of fakeProducts) {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    }
  });

  test("zeigt Preise korrekt formatiert an", async () => {
    render(<ProductList />);

    await screen.findAllByRole("row");

    expect(screen.getByText("59.99 €")).toBeInTheDocument();
    expect(screen.getByText("34.99 €")).toBeInTheDocument();
  });

  test("zeigt Verfügbarkeit korrekt an", async () => {
    render(<ProductList />);

    await screen.findAllByRole("row");

    const aufLager = screen.getAllByText("Auf Lager");
    const nichtVerfuegbar = screen.getAllByText("Nicht verfügbar");

    expect(aufLager).toHaveLength(4);
    expect(nichtVerfuegbar).toHaveLength(1);
  });

  test("zeigt Fehlermeldung bei 500 Internal Server Error", async () => {
    // Handler für diesen Test überschreiben → 500er Antwort
    server.use(errorHandler);

    render(<ProductList />);

    // Warten bis die Fehlermeldung erscheint
    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Fehler beim Laden der Produkte");
    expect(alert).toHaveTextContent("Server-Fehler: 500");
  });

  test("zeigt keine Produkttabelle bei Server-Fehler", async () => {
    server.use(errorHandler);

    render(<ProductList />);

    await screen.findByRole("alert");

    // Tabelle darf nicht existieren
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
