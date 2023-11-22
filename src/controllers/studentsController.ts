import "reflect-metadata";
import "../dependency_injection";
import { Response, Request, NextFunction } from "express";
import Student from "../models/Student";
import { initializeDatabase } from "../db/dbConfig";
import { Database } from "sqlite3";
import createError from "http-errors";
import logger from "../services/logger";
import { CreateStudentUseCase } from "../useCases/CreateStudent";
import { container } from "tsyringe";
import { DeleteStudentUseCase } from "../useCases/DeleteStudent";

let dbPromise = initializeDatabase();

const studentsRoot = (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(201);
};

const addStudentHandler = async (student: Student) => {
    if (!student.name || !student.room || !student.shift || !student.year) {
        throw createError.BadRequest;
    }

    try {
        const db = await dbPromise;
        db.run(
            `INSERT INTO students(name, shift, year, room) VALUES (?, ?, ?, ?)`,
            [student.name, student.shift, student.year, student.room]
        );
        return true;
    } catch (error) {
        throw createError.InternalServerError;
    }
};

export const addStudentHandlerWithInjection = async (student: Student) => {
    const createStudentUseCase = container.resolve(CreateStudentUseCase);
    const newStudent = await createStudentUseCase.execute(student);
    return newStudent;
};

const addStudent = async (req: Request, res: Response) => {
    let student: Student = req.body;

    try {
        addStudentHandler(student);
        res.status(201).send();
    } catch (e) {
        res.send(e);
    }
};

export function addStudentWithInjection(req: Request, res: Response) {
    let student: Student = req.body;

    try {
        addStudentHandlerWithInjection(student);
        res.status(201).send();
    } catch (e) {
        res.send(e);
    }
}

async function deleteStudentHandler(id: string) {
    let sql = `DELETE from students WHERE id="${id}"`;

    const db = await dbPromise;

    await db.run(sql);
}

const deleteStudentByQuery = async (req: Request, res: Response) => {
    let id = req.query.id?.toString();

    try {
        if (id) {
            deleteStudentHandler(id);
            res.send("Student Deleted");
        }
    } catch (error) {
        res.send(error);
    }
};

const deleteStudentByParams = async (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;

    try {
        deleteStudentHandler(id);
        res.send("Student Deleted");
    } catch (error) {
        res.send(error);
    }
};

export async function deleteStudentHandlerWithInjection(id: string) {
    const deleteStudentUseCase = container.resolve(DeleteStudentUseCase);
    await deleteStudentUseCase.execute(id);
}

const deleteStudentByQueryWithInjection = async (
    req: Request,
    res: Response
) => {
    let id = req.query.id?.toString();

    try {
        if (id) {
            deleteStudentHandlerWithInjection(id);
            res.send("Student Deleted");
        }
    } catch (error) {
        res.send(error);
    }
};

const deleteStudentByParamsWithInjection = async (
    req: Request,
    res: Response
) => {
    logger.info(req);
    let id = req.params.id;

    try {
        deleteStudentHandlerWithInjection(id);
        res.send("Student Deleted");
    } catch (error) {
        res.send(error);
    }
};

const studentDetailsByQuery = async (req: Request, res: Response) => {
    logger.info(req);
    let id = req.query.id;
    let sql = `SELECT * FROM students WHERE id="${id}"`;

    const db = await dbPromise;
    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.send("Estudante não existe");
        }
    });
};

const studentDetailsByParams = async (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `SELECT * FROM students WHERE id="${id}"`;

    const db = await dbPromise;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.send("Estudante não existe");
        }
    });
};

const studentsListHandler = async () => {
    const db = await dbPromise;

    try {
        const students: Student = await db.all(`SELECT * from students`);
        return students;
    } catch (error) {
        throw createError.InternalServerError;
    }
};

const studentsList = async (req: Request, res: Response) => {
    try {
        const studentsList = await studentsListHandler();
        res.send(studentsList);
    } catch (error) {
        res.status(500).send(error);
    }
};

const studentsListByYearAndRoom = async (req: Request, res: Response) => {
    logger.info(req);
    let studentsList: Student[] = [];
    let year = req.query.year;
    let room = req.query.room?.toString().toUpperCase();

    let sql = `SELECT * FROM students WHERE year="${year}" AND room="${room}"`;

    const db = await dbPromise;
    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            rows.forEach((row: Student) => {
                studentsList.push(row);
            });
            res.send(studentsList);
        } else {
            res.send("Os parâmetros apresentados não rertonaram resultado.");
        }
    });
};

const updateStudent = async (req: Request, res: Response) => {
    logger.info(req);
    let student: Student = req.body;
    let roomToUppercase = student.room.toUpperCase();
    let sql = `UPDATE students SET name="${student.name}", 
                                   shift="${student.shift}", 
                                   year="${student.year}",
                                   room="${roomToUppercase}"
                                   WHERE id="${student.id}"
                                   `;

    const db = await dbPromise;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Updated");
    });
};

const updateStudentBySpecificField = async (req: Request, res: Response) => {
    logger.info(req);
    let student: Student = req.body;
    let sql = `UPDATE students SET name="${student.name}"
                                   WHERE id="${student.id}"
    `;

    const db = await dbPromise;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Updated");
    });
};

export {
    addStudentHandler,
    studentsListHandler,
    studentsRoot,
    studentsList,
    studentsListByYearAndRoom,
    studentDetailsByQuery,
    studentDetailsByParams,
    addStudent,
    updateStudent,
    updateStudentBySpecificField,
    deleteStudentByQuery,
    deleteStudentByParams,
};
