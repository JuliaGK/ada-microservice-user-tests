import Student from "../models/Student";
import { IStudentsRepository } from "./IStudentsRepository";
import { faker } from "@faker-js/faker";

export class FakeStudentsRepository implements IStudentsRepository {
    private students: Student[] = [];
    async createStudent(student: Student) {
        const newStudent = {
            ...student,
            id: faker.number.int({ min: 1, max: 2000 }),
        };
        this.students.push(newStudent);
        return newStudent;
    }

    async deleteStudentById(id: String) {
        this.students = this.students.filter(
            (student) => student.id != Number(id)
        );
    }
}
