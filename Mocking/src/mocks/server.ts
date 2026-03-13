import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Nutzt Msw in einem Node.js enviroment
//Intercepted die Http request die bei den tests gemacht werden
// Responeded mit den vordefinierten handlers
//Anstatt das Backend wirklich zu callen
export const server = setupServer(...handlers);
