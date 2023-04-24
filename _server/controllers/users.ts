import { Request, Response } from "express"
import { sp } from "@pnp/sp-commonjs";
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
        console.log("req.body", req.body)
        //console.log("file", req.files)
        const response = await sp.web.lists.getByTitle("Users").items.add({
            name: req.body.name,
            Email: req.body.email,
            PhoneNo: req.body.phone,
            Address: req.body.address,

        });
        const folderId = response.data.Id;
        const newFolderName = `${folderId}`;
        const documentLibraryName = `UserDetails`;
        const documentLibrary = sp.web.lists.getByTitle(documentLibraryName);
        await documentLibrary.rootFolder.folders
            .addUsingPath(newFolderName)
            .then(() => {
                console.log(`Folder '${newFolderName}' created successfully.`);
            });

        // let result: any;
        // result = await sp.web.getFolderByServerRelativePath(response.data?.ServerRelativeUrl).files
        //     .addUsingPath(file.image.name, fileBuffer, { Overwrite: true });
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

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

const updateSingleEmploy = async (req: Request, res: Response) => {
    let id: number = Number.parseInt(req.params.id);
    const { name, email, phone, address } = req.body;
    console.log(req.body)
    console.log(id);
    try {
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid ID provided",
            });
            return;
        }
        const updateEmploy = {
            name: name,
            Email: email,
            PhoneNo: phone,
            Address: address

        };
        const employ = await sp.web.lists
            .getByTitle("Users").items.getById(id).update(updateEmploy);
        res.status(200).json({
            success: true,
            message: " Succesfully Updated Employee Details",
            employ
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error " });
    }
}

const uploadDocument = async (req:any, res: Response) => {
    console.log(req.files)
    let file = req.files;
    let id: number = Number.parseInt(req.params.id);
    // console.log("imagetype", file);
    if (!file) {
        console.error("No file selected");
        return res.status(400).json({
            success: false,
            message: "No file selected",
        });
    }
    console.log(file)
    const documentLibraryName = `UserDetails/${id}`;
    const fileNamePath = file.name;
    let result: any;
    if (file.size <= 10485760) {
        // small upload
        console.log("Starting small file upload");
        result = await sp.web
            .getFolderByServerRelativePath(documentLibraryName)
            .files.addUsingPath(fileNamePath, file.data, { Overwrite: true });
    } else {
        // large upload
        console.log("Starting large file upload");
        result = await sp.web
            .getFolderByServerRelativePath(documentLibraryName)
            .files.addChunked(
                fileNamePath, file, () => {
                    console.log(`Upload progress: `);
                },
                true
            );
    }
    res.status(200).json({
        success: true,
        message: "Document Uploaded succesfullly",
    });

};

// Get all files in a directory

const getFilesInDirectory = async (req: Request, res: Response) => {
    let id: number = Number.parseInt(req.params.id);
    console.log("files listn");
    const documentLibraryName = `UserDetails/${id}`;
    try {
        const folder = await sp.web
            .getFolderByServerRelativePath(documentLibraryName)
            .files.get();
        console.log("Folder : ", folder);
        console.log(documentLibraryName);
        const files = folder.map((file: any) => {
            return file;
        });

        res.status(200).json({
            success: true,
            message: "Retrieved files in directory",
            files,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error retrieving files in directory",
        });
    }
};



export {
    getAllEmployees, getAllEmployeesById, deleteEmployee, AddEmployees, updateSingleEmploy,uploadDocument
}







