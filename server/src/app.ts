import express from 'express';
import bodyParser from "body-parser";
const app = express()
const PORT = 5000
import cors from "cors";
require("@pnp/sp-commonjs/webs");
require("@pnp/sp-commonjs/items");
import { sp } from "@pnp/sp-commonjs";
import { SPFetchClient } from "@pnp/nodejs-commonjs";
import { router } from './routes/users'
const SpfxConnection = () => {
    sp.setup({
        sp: {
            fetchClientFactory: () => new SPFetchClient(
                "https://2mxff3.sharepoint.com/sites/Contacts",
                "b096c3dd-6684-4433-8f02-445f15f54c2f",
                "nqpj/S0kwiPsyvnggoL6cgH8Ddx0nQVB44iGCVaFEWE=",
            ),
        },
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({ origin: "*" }));

SpfxConnection()

app.use("/get", router)
app.use("/get/:id", router)
app.use("/deleteuser/:id", router)


app.listen(5000, () =>
    console.log(`Server runing on port http://localhost:${PORT}"`),
);











