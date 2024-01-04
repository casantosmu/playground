import pg from "pg";

export const client = new pg.Client(process.env.PG_URI);
