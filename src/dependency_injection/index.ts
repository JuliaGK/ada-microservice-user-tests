import { container } from "tsyringe";
import { FakeStudentsRepository } from "../repositories/FakeStudentsRepository";
import { StudentsRepository } from "../repositories/StudentsRepository";
const environment = process.env.NODE_ENV;

const registerStudentsRepository = () => {
    container.registerSingleton(
        "StudentsRepository",
        environment === "test" ? FakeStudentsRepository : StudentsRepository
    );
};

registerStudentsRepository();
