# API Mocking mit MSW (Mock Service Worker)

Eine Anleitung zum Aufsetzen von **API Mocking mit Mock Service Worker (MSW)** in einem React + TypeScript Projekt.
HTTP-Requests werden sowohl in der Entwicklung als auch in Tests abgefangen und mit Fake-Daten beantwortet -- ganz ohne echtes Backend.

---

## Tech Stack

| Technologie | Zweck |
|---|---|
| React | UI Framework |
| TypeScript | Typsicherheit |
| Vite | Build Tool & Dev Server |
| MSW | API Mocking (Service Worker) |
| Vitest | Testing Framework |
| Testing Library | Komponenten-Tests |

---

## Voraussetzungen

- **Node.js** >= 18
- **npm** >= 9

---

## Projekt erstellen

### 1. React + TypeScript Projekt aufsetzen

```bash
npm create vite@latest mein-projekt -- --template react-ts
cd mein-projekt
npm install
```

### 2. MSW installieren

```bash
npm install -D msw
```

### 3. Service Worker generieren

```bash
npx msw init public/ --save
```

> Dieser Befehl erstellt `public/mockServiceWorker.js` -- die Datei, die im Browser Requests abfängt.

### 4. Testing-Abhängigkeiten installieren

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom
```

---

## MSW einrichten

### Projektstruktur anlegen

Erstelle folgende Ordner und Dateien unter `src/`:

```
src/
├── mocks/
│   ├── handlers.ts       # Mock-Routen definieren
│   ├── browser.ts        # MSW Browser Setup
│   ├── server.ts         # MSW Server Setup (Tests)
│   └── data.ts           # Fake-Daten
├── api/
│   └── fetchProducts.ts  # Fetch-Funktion
├── components/
│   └── ProductList.tsx   # Komponente
└── tests/
    ├── setup.ts          # Test-Setup
    └── ProductList.test.tsx
```

---

### Fake-Daten erstellen

**`src/mocks/data.ts`**

```ts
export const products = [
  { id: 1, name: "Laptop", price: 999.99 },
  { id: 2, name: "Smartphone", price: 699.99 },
  { id: 3, name: "Kopfhörer", price: 149.99 },
]
```

---

### Request Handler definieren

**`src/mocks/handlers.ts`**

```ts
import { http, HttpResponse } from 'msw'
import { products } from './data'

export const handlers = [
  // Erfolgreiche Antwort
  http.get('https://api.example.com/products', () => {
    return HttpResponse.json(products)
  }),

  // Fehler simulieren
  http.get('https://api.example.com/products-error', () => {
    return new HttpResponse(null, { status: 500 })
  }),
]
```

---

### Browser Setup (Entwicklung)

**`src/mocks/browser.ts`**

```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

---

### Server Setup (Tests)

**`src/mocks/server.ts`**

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

---

### MSW im Einstiegspunkt starten

**`src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

async function start() {
  const { worker } = await import('./mocks/browser')
  await worker.start()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

start()
```

> MSW wird **vor** dem Rendern gestartet, damit alle Requests sofort abgefangen werden.

---

## Testen einrichten

### Vitest konfigurieren

**`vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
  },
})
```

---

### Test-Setup

**`src/tests/setup.ts`**

```ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '../mocks/server'
import '@testing-library/jest-dom'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

### Beispiel-Test schreiben

**`src/tests/ProductList.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductList from '../components/ProductList'

describe('ProductList', () => {
  it('zeigt Produkte nach dem Laden an', async () => {
    render(<ProductList />)
    expect(await screen.findByText('Laptop')).toBeInTheDocument()
  })
})
```

---

## Wie funktioniert MSW?

**Im Browser:** MSW registriert einen Service Worker (`public/mockServiceWorker.js`), der HTTP-Requests abfängt und gemockte Antworten liefert.

**In Tests:** MSW nutzt `setupServer()` um Requests auf Node.js-Ebene abzufangen -- kein Browser nötig.

---

## Eigene Handler hinzufügen

Neue Mock-Routen einfach in `src/mocks/handlers.ts` ergänzen:

```ts
// POST Request
http.post('https://api.example.com/products', async ({ request }) => {
  const newProduct = await request.json()
  return HttpResponse.json(newProduct, { status: 201 })
}),

// Mit URL-Parametern
http.get('https://api.example.com/products/:id', ({ params }) => {
  const { id } = params
  return HttpResponse.json({ id, name: 'Produkt ' + id })
}),
```

---

## Scripts

| Befehl | Beschreibung |
|---|---|
| `npm run dev` | Startet den Vite Dev Server |
| `npm run build` | Kompiliert TypeScript & erstellt Production Build |
| `npm run preview` | Vorschau des Production Builds |
| `npm run lint` | ESLint Code-Prüfung |
| `npm test` | Alle Tests einmalig ausführen |
| `npm run test:watch` | Tests im Watch-Modus |

---

## Konfiguration

| Datei | Zweck |
|---|---|
| `vite.config.ts` | Vite + Vitest Konfiguration |
| `tsconfig.json` | TypeScript Compiler-Optionen |
| `eslint.config.js` | Linting-Regeln |

Es werden **keine Umgebungsvariablen** oder `.env`-Dateien benötigt.
Alle API-URLs sind Beispiel-URLs (`https://api.example.com/...`), die von MSW abgefangen werden.
