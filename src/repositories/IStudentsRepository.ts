import Student from "../models/Student";

export interface IStudentsRepository {
    createStudent: (student: Student) => Promise<Student>;
    deleteStudentById: (id: string) => {};
}
