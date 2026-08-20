import * as dotenv from "dotenv"
import type { Config } from "drizzle-kit"

dotenv.config({
    path: '.dev.vars'
})

const dbUrlStr = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/vesper";
const dbUrl = new URL(dbUrlStr);

const isLocalhost = dbUrl.hostname === "localhost" || dbUrl.hostname === "127.0.0.1";

export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        host: dbUrl.hostname || "localhost",
        port: parseInt(dbUrl.port || "5432"),
        user: dbUrl.username || "postgres",
        password: dbUrl.password || "",
        database: dbUrl.pathname.slice(1) || "vesper",
        ssl: isLocalhost ? false : "require"
    }
} satisfies Config