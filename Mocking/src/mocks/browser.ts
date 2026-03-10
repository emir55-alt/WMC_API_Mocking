import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// MSW Service Worker für den Browser einrichten
export const worker = setupWorker(...handlers);
