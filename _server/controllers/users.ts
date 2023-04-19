import { Request, Response } from "express"
import { sp } from "@pnp/sp-commonjs";
import { SPFetchClient } from "@pnp/nodejs-commonjs";
const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const response = await sp.web.lists.getByTitle("Users").items.getAll()
        return res.json(response)
    } catch (error) {
        console.log(error)
    }
}
const getAllEmployeesById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        const response = await sp.web.lists.getByTitle("Users").items.getById(Number(id)).get();
        return res.json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

const AddEmployees = async (req: Request, res: Response) => {
    try {

        console.log("first")
        const newUser = {
            Id: req.body.Id,
            name: req.body.name,
            Email: req.body.Email,
            PhoneNo: req.body.PhoneNo,
            Address: req.body.Address,
        };
        console.log(newUser)
        const response = await sp.web.lists.getByTitle("Users").items.add({
            name: newUser.name,
            Email: newUser.Email,
            PhoneNo: newUser.PhoneNo,
            Address: newUser.Address,

        });
        console.log(response.data.Id);
        const folderId = response.data.Id;
        const newFolderName = `${folderId}`;
        const documentLibraryName = `DocumentNeetha`;
        const documentLibrary = sp.web.lists.getByTitle(documentLibraryName);
        await documentLibrary.rootFolder.folders
            .addUsingPath(newFolderName)
            .then(() => {
                console.log(`Folder '${newFolderName}' created successfully.`);
            });
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }

};
const deleteEmployee = async (req: Request, res: Response) => {
    console.log("delete employee");
    let id: number = Number.parseInt(req.params.id);
    console.log("id", id);
    try {
        let user = await sp.web.lists.getByTitle("Users").items.getById(id);
        if (!user) {
            throw new Error("User not found");
        } else {
            await sp.web.lists.getByTitle("Users").items.getById(id).delete();
            res.send({ message: "Deleted successfully" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Internal Server Error` });
    }
};
export {
    getAllEmployees, getAllEmployeesById, deleteEmployee,AddEmployees
}








// import { v4 as uuid } from "uuid";
// interface User {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     address: string;
// }

// let users: User[] = [];


// export const getUsers = (req: any, res: any):void=> {
//     res.send(users);
// };
// export const createUser = (req:any, res:any):void=> {
//     const user = req.body;
//     users.push({ ...user, id: uuid() });
//     res.send("user added successfully");
// };
// export const getUser = (req:any, res:any):void=> {
//     const singleUser = users.filter((user)=>user.id===req.params.id);
//     res.send(singleUser);
// };
// export const deleteUser = (req:any, res:any):void=> {
//     users = users.filter((user)=>user.id!==req.params.id);
//     res.send("User deleted successfully");
// };
// export const updateUser = (req:any, res:any):void=> {
//     const user = users.find((user)=>user.id===req.params.id);
//     if (user) {
//         user.name = req.body.name;
//         user.email = req.body.email;
//         user.phone = req.body.phone;
//         user.address = req.body.address;
//         res.send("User updated successfully");
//     } else {
//         res.status(404).send("User not found");
//     }
// };