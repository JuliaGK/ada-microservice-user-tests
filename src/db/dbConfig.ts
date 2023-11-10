import { sqlite3 } from "sqlite3";
import { open } from "sqlite";

const sqlite3 = require("sqlite3").verbose();
const filePath: string = "src/db/school.db";

const initializeDatabase = async () => {
    const dbFilename =
        process.env.NODE_ENV === "test"
            ? "src/db/test_database.sqlite"
            : "src/db/database.sqlite";
    return open({
        filename: dbFilename,
        driver: sqlite3.Database,
    });
};

export { initializeDatabase };
