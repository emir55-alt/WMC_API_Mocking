import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "../mocks/server";

// MSW Server vor allen Tests starten
beforeAll(() => server.listen());

// Nach jedem Test die Handler zurücksetzen + DOM aufräumen
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Nach allen Tests den Server schließen
afterAll(() => server.close());
