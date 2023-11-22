import "reflect-metadata";
import "./dependency_injection";

import express from "express";
import dotenv from "dotenv";
import studentsRouter from "./routes/studentsRouter";
import cors, { CorsOptions } from "cors"; // Middleware para habilitar CORS
import professionalsRouter from "./routes/professionalsRouter";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

const ALLOWED_ORIGIN = "http://localhost:4000";

const corsOptions: CorsOptions = {
    origin: function (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) {
        if (!origin) {
            // Se não há cabeçalho de origem, rejeitamos a requisição
            callback(new Error("Origin header missing or undefined"));
            return;
        }

        if (origin === ALLOWED_ORIGIN) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h3 style='color: green'>Hello World</h3>");
});

app.use("/students", studentsRouter);
app.use("/professionals", professionalsRouter);

app.listen(port, () => {
    console.log(`Servidor escutando na porta ${port}`);
});
