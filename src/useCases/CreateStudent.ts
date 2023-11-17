import { inject, injectable } from "tsyringe";
import Student from "../models/Student";
import { IStudentsRepository } from "../repositories/IStudentsRepository";
import createHttpError from "http-errors";

@injectable()
export class CreateStudentUseCase {
    constructor(
        @inject("StudentsRepository")
        private studentsRepository: IStudentsRepository
    ) {}

    async execute(student: Student) {
        if (!student.name || !student.room || !student.shift || !student.year) {
            throw createHttpError.BadRequest(
                "Propriedades obrigatórias ausentes no corpo da requisição."
            );
        }

        try {
            const newStudent = this.studentsRepository.createStudent(student);
            return newStudent;
        } catch (error) {
            console.log("Erro ao inserir estudante: ", error);
            throw createHttpError.InternalServerError(
                "Erro interno ao criar estudante"
            );
        }
    }
}
