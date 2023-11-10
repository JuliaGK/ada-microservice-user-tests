import { readFileSync } from "fs";
import { join } from "path";
import { initializeDatabase } from "./dbConfig";

const migrationDir = join(__dirname, "migrations");

const applyMigrations = async () => {
    const db = await initializeDatabase();

    const migrations = ["001-initial-schema.sql"];

    for (const migration of migrations) {
        const migrationScript = readFileSync(
            join(migrationDir, migration),
            "utf8"
        );

        await db.exec(migrationScript);
    }

    console.log("Migrações aplicadas com sucesso.");
};

applyMigrations();
