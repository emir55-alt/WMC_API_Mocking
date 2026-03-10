import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// MSW Server für Node.js (Tests)
export const server = setupServer(...handlers);
