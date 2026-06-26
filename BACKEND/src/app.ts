import express, {Request, Response, NextFunction} from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/health", (req:Request, res:Response, next:NextFunction) => {
    res.send("HELLO WORD")
})

export default app;