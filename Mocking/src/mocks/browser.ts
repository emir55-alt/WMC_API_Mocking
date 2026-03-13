import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// MSW Service Worker für den Browser einrichten
//Intercepted die fetches die vom frontend gemacht werden
//und returned die "mocked" antworten mit den fake daten
export const worker = setupWorker(...handlers);
