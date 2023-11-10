import { Response, Request, NextFunction } from "express";
import Student from "../models/Student";
import { initializeDatabase } from "../db/dbConfig";
import { Database } from "sqlite3";
import createError from "http-errors";
import logger from "../services/logger";

let dbPromise = initializeDatabase();

const studentsRoot = (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(201);
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

const addStudent = async (req: Request, res: Response) => {
    let student: Student = req.body;

    try {
        addStudentHandler(student);
        res.status(201).send();
    } catch (e) {
        res.send(e);
    }
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

const deleteStudentByQuery = async (req: Request, res: Response) => {
    logger.info(req);
    let id = req.query.id;
    let sql = `DELETE from students WHERE id="${id}"`;

    const db = await dbPromise;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Deleted");
    });
};

const deleteStudentByParams = async (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `DELETE from students WHERE id="${id}"`;

    const db = await dbPromise;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Deleted");
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
