import { inject, injectable } from "tsyringe";
import { IStudentsRepository } from "../repositories/IStudentsRepository";
import createHttpError from "http-errors";

@injectable()
export class DeleteStudentUseCase {
    constructor(
        @inject("StudentsRepository")
        private studentsRepository: IStudentsRepository
    ) {}

    async execute(id: string) {
        try {
            this.studentsRepository.deleteStudentById(id);
        } catch (error) {
            console.log("Erro ao deletar estudante: ", error);
            throw createHttpError.InternalServerError(
                "Erro interno ao deletar estudante"
            );
        }
    }
}
