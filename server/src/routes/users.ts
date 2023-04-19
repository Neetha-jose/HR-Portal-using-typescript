import express from "express"
import {deleteEmployee, getAllEmployees,getAllEmployeesById,} from "../controllers/users"
const router =express.Router()
router.get("/",getAllEmployees)
router.get("/:id",getAllEmployeesById)
router.delete("deleteuser/:id",deleteEmployee)
export{router}


















//import express from "express";
// import { getUsers, createUser, getUser, deleteUser, updateUser } from "../controllers/users";
// const router = express.Router();
// router.get("/users", getUsers);
// router.post("/user", createUser);
// router.get("/user:id", getUser);
// router.delete("/user:id", deleteUser);
// router.put("/user:id", updateUser);
// export default router;