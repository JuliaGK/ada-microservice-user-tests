import { test, expect, beforeEach } from "vitest";
import { initializeDatabase } from "../db/dbConfig";
import Student from "../models/Student";
import { addStudentHandler, studentsListHandler } from "./studentsController";

beforeEach(async () => {
    const db = await initializeDatabase();
    await db.run("DELETE FROM students");
});

test("inserir três alunos e verificar se foram salvos no banco", async () => {
    const studentsToAdd: Student[] = [
        {
            id: 1,
            name: "Bianca",
            room: "A",
            shift: "Manhã",
            year: "6",
        },
        {
            id: 2,
            name: "Carla",
            room: "A",
            shift: "Manhã",
            year: "6",
        },
        {
            id: 3,
            name: "Josué",
            room: "A",
            shift: "Manhã",
            year: "6",
        },
    ];

    for (const student of studentsToAdd) {
        await addStudentHandler(student);
    }

    const students = await studentsListHandler();

    expect(students).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ name: "Bianca" }),
            expect.objectContaining({ name: "Carla" }),
            expect.objectContaining({ name: "Josué" }),
        ])
    );
});

test("verifica se recebe lista vazia", async () => {
    const students = await studentsListHandler();

    expect(students).toHaveLength(0);
});
