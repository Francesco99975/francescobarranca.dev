import Admin from "../interfaces/admin";

declare module "h3" {
  interface H3EventContext {
    user?: Admin;
  }
}

export {};
