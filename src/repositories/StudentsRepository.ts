import { initializeDatabase } from "../db/dbConfig";
import Student from "../models/Student";
import { IStudentsRepository } from "./IStudentsRepository";

export class StudentsRepository implements IStudentsRepository {
    async createStudent(student: Student): Promise<Student> {
        const dbPromise = initializeDatabase();
        const db = await dbPromise;
        await db.run(
            "INSERT INTO students (name, shift, year, room) VALUES (?, ?, ?, ?)",
            [student.name, student.shift, student.year, student.room]
        );

        const newStudent = await db.get(
            "SELECT * FROM students ORDER BY id DESC LIMIT 1"
        );

        return newStudent as Student;
    }

    async deleteStudentById(id: string) {
        const dbPromise = initializeDatabase();
        const db = await dbPromise;
        await db.run("DELETE from students WHERE id=?", [id]);
    }
}
