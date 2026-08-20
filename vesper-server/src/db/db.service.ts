import { neon } from "@neondatabase/serverless"
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http"
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

export interface Env {
    DATABASE_URL: string
}

export const getDb = (databaseUrl: string) => {
    if (databaseUrl && databaseUrl.includes("neon.tech")) {
        const client = neon(databaseUrl)
        return drizzleNeon(client, { schema })
    }
    const client = postgres(databaseUrl)
    return drizzlePostgres(client, { schema })
}