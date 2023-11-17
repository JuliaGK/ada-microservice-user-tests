import { Router } from "express";
import { container } from "tsyringe";
import {
    studentsRoot,
    studentsList,
    studentsListByYearAndRoom,
    studentDetailsByQuery,
    studentDetailsByParams,
    addStudent,
    updateStudent,
    deleteStudentByQuery,
    deleteStudentByParams,
    updateStudentBySpecificField,
} from "../controllers/studentsController";

const studentsRouter = Router();

studentsRouter.get("/", studentsRoot);

studentsRouter.get("/studentsList", studentsList);

studentsRouter.get("/studentsListByYearAndRoom", studentsListByYearAndRoom);

studentsRouter.get("/studentDetails/", studentDetailsByQuery);

studentsRouter.get("/studentDetails/:id", studentDetailsByParams);

studentsRouter.post("/addStudent", addStudent);

studentsRouter.put("/updateStudent", updateStudent);

studentsRouter.patch(
    "/updateStudentBySpecificField",
    updateStudentBySpecificField
);

studentsRouter.delete("/deleteStudent", deleteStudentByQuery);

studentsRouter.delete("/deleteStudent/:id", deleteStudentByParams);

export default studentsRouter;
