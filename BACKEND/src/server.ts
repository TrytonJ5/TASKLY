import dotenv from "dotenv";
dotenv.config();

import app from "./app";



const PORT : number = Number(process.env.PORT);



app.listen(PORT, ()=> console.log(`Taskly rodando com sucesso na porta ${PORT}!`))